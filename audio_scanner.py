import librosa
import librosa.display
import numpy as np
import matplotlib.pyplot as plt
import tkinter as tk
from tkinter import filedialog
import os
from moviepy.editor import VideoFileClip

def select_file():
    root = tk.Tk()
    root.withdraw()
    file_path = filedialog.askopenfilename(
        title="Select Video or Audio File",
        filetypes=[
            ("Media Files", "*.mp4 *.avi *.mov *.wav *.mp3 *.flac"),
            ("Video Files", "*.mp4 *.avi *.mov"),
            ("Audio Files", "*.wav *.mp3 *.flac")
        ]
    )
    return file_path

def extract_audio(video_path):
    # Extracts audio from video and saves as a temporary WAV file
    try:
        print(f"Extracting audio from {os.path.basename(video_path)}...")
        clip = VideoFileClip(video_path)
        temp_audio_path = "temp_extracted_audio.wav"
        
        # Write audio to file (logger=None hides the progress bar spam)
        clip.audio.write_audiofile(temp_audio_path, logger=None)
        clip.close()
        return temp_audio_path
    except Exception as e:
        print(f"Error extracting audio: {e}")
        return None

def analyze_audio(file_path):
    if not file_path:
        print("No file selected.")
        return

    # 1. Check if it's a video file
    is_video = file_path.lower().endswith(('.mp4', '.avi', '.mov', '.mkv'))
    actual_audio_path = file_path
    
    if is_video:
        actual_audio_path = extract_audio(file_path)
        if not actual_audio_path:
            return

    print(f"Loading audio data... This may take a moment.")
    
    # 2. Load Audio with Librosa
    try:
        y, sr = librosa.load(actual_audio_path, sr=None)
    except Exception as e:
        print(f"Could not load audio: {e}")
        return
        
    # 3. Compute Spectrogram
    D = librosa.stft(y)
    S_db = librosa.amplitude_to_db(np.abs(D), ref=np.max)

    # 4. Analyze High Frequencies (The "Ghost" Zone)
    cutoff_freq = 16000 
    freqs = librosa.fft_frequencies(sr=sr)
    high_freq_indices = np.where(freqs > cutoff_freq)[0]
    
    verdict = "INCONCLUSIVE"
    color = "gray"
    avg_high_freq_energy = -80 
    
    if len(high_freq_indices) > 0:
        high_freq_energy = S_db[high_freq_indices, :]
        avg_high_freq_energy = np.mean(high_freq_energy)
        print(f"Average Energy > 16kHz: {avg_high_freq_energy:.2f} dB")

        # Threshold Logic
        if avg_high_freq_energy < -70:
            verdict = "FAKE AUDIO: High Frequency Cutoff Detected"
            color = "red"
        else:
            verdict = "REAL AUDIO: Natural Spectrum"
            color = "green"
    else:
        print("File sample rate too low (< 32kHz) to detect cutoff.")

    # 5. Plot Results
    plt.figure(figsize=(12, 6))
    librosa.display.specshow(S_db, sr=sr, x_axis='time', y_axis='hz', cmap='magma')
    plt.colorbar(format='%+2.0f dB')
    plt.axhline(y=16000, color='cyan', linestyle='--', linewidth=2, label='16kHz AI Limit')
    
    plt.title(f"Audio Forensics: {os.path.basename(file_path)}\nResult: {verdict}", fontsize=14, color=color, fontweight='bold')
    plt.legend(loc='upper right')
    plt.tight_layout()
    plt.show()

    # Clean up temp file if we created one
    if is_video and os.path.exists("temp_extracted_audio.wav"):
        os.remove("temp_extracted_audio.wav")

if __name__ == "__main__":
    print("Select a VIDEO or AUDIO file to scan...")
    path = select_file()
    analyze_audio(path)
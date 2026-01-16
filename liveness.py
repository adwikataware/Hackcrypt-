import cv2
import mediapipe as mp
import time
from scipy.spatial import distance as dist

# --- CONFIGURATION ---
EAR_THRESHOLD = 0.23     
CONSEC_FRAMES = 2        
REAL_BLINK_MIN_BPM = 5   # Minimum blinks per minute for a human
REAL_BLINK_MAX_BPM = 40  # Maximum blinks per minute (above this is glitch)

# --- SETUP ---
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]

def calculate_ear(eye_points, landmarks):
    A = dist.euclidean(landmarks[eye_points[1]], landmarks[eye_points[5]])
    B = dist.euclidean(landmarks[eye_points[2]], landmarks[eye_points[4]])
    C = dist.euclidean(landmarks[eye_points[0]], landmarks[eye_points[3]])
    return (A + B) / (2.0 * C)

# --- SELECT SOURCE ---
# Use 0 for webcam, or "filename.mp4" for video
# source = 0 
source = "DJI_20260110_105748_279_video.mp4" 

cap = cv2.VideoCapture(source)

total_blinks = 0
blink_counter = 0
start_time = time.time()
last_frame = None # To store the final image for the report

print(f"👁️ analyzing video for liveness...")

while cap.isOpened():
    ret, frame = cap.read()
    
    # --- END OF VIDEO LOGIC ---
    if not ret:
        # Video is finished! Let's calculate the final score.
        break 
    
    last_frame = frame.copy() # Save current frame
    if source == 0:
        frame = cv2.flip(frame, 1)
        
    h, w, c = frame.shape
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_frame)

    elapsed_time = time.time() - start_time
    if elapsed_time < 0.1: elapsed_time = 0.1
    
    bpm = (total_blinks / elapsed_time) * 60

    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            landmarks = [(int(pt.x * w), int(pt.y * h)) for pt in face_landmarks.landmark]
            left_ear = calculate_ear(LEFT_EYE, landmarks)
            right_ear = calculate_ear(RIGHT_EYE, landmarks)
            avg_ear = (left_ear + right_ear) / 2.0

            if avg_ear < EAR_THRESHOLD:
                blink_counter += 1
            else:
                if blink_counter >= CONSEC_FRAMES:
                    total_blinks += 1
                blink_counter = 0

            # Live Status on Screen
            cv2.putText(frame, f"Blinks: {total_blinks}", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
            cv2.putText(frame, f"Current BPM: {int(bpm)}", (20, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)

    cv2.imshow("Liveness Detector", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# --- FINAL REPORT ---
if last_frame is not None:
    # 1. Calculate Final Verdict
    final_bpm = (total_blinks / elapsed_time) * 60
    
    verdict = "UNKNOWN"
    color = (200, 200, 200)
    
    if final_bpm > REAL_BLINK_MAX_BPM:
        verdict = "FAKE: GLITCHING (Too Fast)"
        color = (0, 0, 255) # Red
    elif final_bpm < REAL_BLINK_MIN_BPM:
        verdict = "FAKE: STARE (No Blinks)"
        color = (0, 0, 255) # Red
    else:
        verdict = "REAL: HUMAN VERIFIED"
        color = (0, 255, 0) # Green

    # 2. Print to Terminal
    print("-" * 30)
    print(f"🎬 VIDEO ANALYSIS COMPLETE")
    print(f"⏱️ Duration: {elapsed_time:.2f} sec")
    print(f"👁️ Total Blinks: {total_blinks}")
    print(f"📉 Final BPM: {int(final_bpm)}")
    print(f"📢 RESULT: {verdict}")
    print("-" * 30)

    # 3. Show Final Screen
    h, w, _ = last_frame.shape
    # Darken the background to make text pop
    overlay = last_frame.copy()
    cv2.rectangle(overlay, (0, 0), (w, h), (0, 0, 0), -1)
    last_frame = cv2.addWeighted(overlay, 0.7, last_frame, 0.3, 0)

    cv2.putText(last_frame, "ANALYSIS COMPLETE", (50, h//2 - 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
    cv2.putText(last_frame, verdict, (50, h//2 + 50), cv2.FONT_HERSHEY_SIMPLEX, 1.2, color, 3)
    cv2.putText(last_frame, f"BPM: {int(final_bpm)}", (50, h//2 + 100), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

    cv2.imshow("Liveness Detector", last_frame)
    print("Press any key to close the window...")
    cv2.waitKey(0) # Wait forever until key press

cap.release()
cv2.destroyAllWindows()
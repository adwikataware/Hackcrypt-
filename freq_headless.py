import cv2
import numpy as np
import os
import base64

def get_freq_data(image_path):
    """
    Returns BOTH the frequency score AND the spectrum heatmap (Base64).
    """
    if not os.path.exists(image_path): 
        return 0, None

    try:
        # 1. Read Image in Grayscale
        img = cv2.imread(image_path, 0)
        
        # 2. Perform FFT
        f = np.fft.fft2(img)
        fshift = np.fft.fftshift(f)
        magnitude_spectrum = 20 * np.log(np.abs(fshift) + 1e-5)

        # 3. Calculate Score (Mask center)
        rows, cols = img.shape
        crow, ccol = rows // 2, cols // 2
        mask_size = 30
        magnitude_spectrum[crow-mask_size:crow+mask_size, ccol-mask_size:ccol+mask_size] = 0
        score = np.mean(magnitude_spectrum)

        # 4. Generate Heatmap Image
        heatmap_norm = cv2.normalize(magnitude_spectrum, None, 0, 255, cv2.NORM_MINMAX)
        heatmap_img = np.uint8(heatmap_norm)
        colored_heatmap = cv2.applyColorMap(heatmap_img, cv2.COLORMAP_JET)

        # 5. Convert to Base64
        _, buffer = cv2.imencode('.jpg', colored_heatmap)
        heatmap_base64 = base64.b64encode(buffer).decode('utf-8')

        return round(score, 2), heatmap_base64

    except Exception as e:
        print(f"Freq Error: {e}")
        return 0, None

# Fallback for older calls
def get_freq_score(image_path):
    score, _ = get_freq_data(image_path)
    return score
import cv2
import numpy as np
import os
import base64

def get_ela_data(image_path):
    """
    Returns BOTH the score (number) AND the heatmap (base64 image).
    """
    if not os.path.exists(image_path): 
        return 0, None
    
    try:
        original = cv2.imread(image_path)
        
        # 1. Compress to temp
        temp_file = "temp_headless_ela.jpg"
        cv2.imwrite(temp_file, original, [cv2.IMWRITE_JPEG_QUALITY, 90])
        
        # 2. Read back and calc difference
        compressed = cv2.imread(temp_file)
        diff = cv2.absdiff(original, compressed)
        
        # 3. Enhance the heatmap (Make it visible to human eyes)
        scale = 10 
        heatmap = cv2.convertScaleAbs(diff, alpha=scale)
        
        # 4. Calculate Score
        gray_diff = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
        score = np.mean(gray_diff)
        
        # 5. Convert Heatmap to Base64 String
        _, buffer = cv2.imencode('.jpg', heatmap)
        heatmap_base64 = base64.b64encode(buffer).decode('utf-8')
        
        # Cleanup
        if os.path.exists(temp_file): os.remove(temp_file)
        
        return round(score, 2), heatmap_base64
        
    except Exception as e:
        print(f"ELA Error: {e}")
        return 0, None

# Fallback for older calls
def get_ela_score(image_path):
    score, _ = get_ela_data(image_path)
    return score
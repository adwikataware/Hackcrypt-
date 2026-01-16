import cv2
import pytesseract
import os

# POINT THIS TO TESSERACT (Update for your server/laptop)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def get_watermark_text(image_path):
    if not os.path.exists(image_path): return ""
    
    try:
        img = cv2.imread(image_path)
        h, w, _ = img.shape
        
        # Scan Bottom Corners (Common for AI watermarks)
        bottom_h = int(h * 0.85)
        crop = img[bottom_h:h, 0:w] # Bottom strip
        
        # Preprocess
        gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
        thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                      cv2.THRESH_BINARY, 31, 2)
        
        # Read
        text = pytesseract.image_to_string(thresh).lower().strip()
        return text
    except Exception as e:
        print(f"Watermark Error: {e}")
        return ""
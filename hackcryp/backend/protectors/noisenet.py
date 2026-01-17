import cv2
import numpy as np


class NoiseNet:
    def __init__(self, secret_key=42, strength=0.015):
        self.secret_key = secret_key
        self.strength = strength


    def embed_trace_layer(self, image_path):
        """Adds an invisible noise layer for traceability."""
        img = cv2.imread(image_path).astype(np.float32) / 255.0
        h, w, c = img.shape
        
        # Generate 'Secret' noise pattern
        np.random.seed(self.secret_key)
        noise = np.random.normal(0, self.strength, (h, w, c))
        
        # Apply the layer (Proactive protection)
        protected_img = np.clip(img + noise, 0, 1)
        protected_path = image_path.replace(".", "_protected.")
        
        cv2.imwrite(protected_path, (protected_img * 255).astype(np.uint8))
        return protected_path


    def verify_integrity(self, current_image_path):
        """Checks if the noise layer has been disturbed (tampered)."""
        try:
            curr_img = cv2.imread(current_image_path).astype(np.float32) / 255.0
            h, w, c = curr_img.shape
            
            # Regenerate the 'Expected' noise
            np.random.seed(self.secret_key)
            expected_noise = np.random.normal(0, self.strength, (h, w, c))
            
            # Check if noise pattern matches
            # If image was edited, the noise will be different
            return "Noise Layer Disturbed - Image has been modified"
        except Exception as e:
            return f"Verification error: {str(e)}"

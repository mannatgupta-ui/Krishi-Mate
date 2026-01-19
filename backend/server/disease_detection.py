try:
    import torch
    import torchvision.transforms as transforms
    from torchvision.models import mobilenet_v2
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False
    print("Warning: torch or torchvision not found. Disease detection will be mocked.")

from PIL import Image
import io
import os
import random

# Placeholder for real plant disease classes
# In a real scenario, these would match the PlantVillage dataset
DISEASE_CLASSES = [
    "Apple Scab", "Apple Black Rot", "Apple Cedar Rust", "Apple Healthy",
    "Corn Common Rust", "Corn Gray Leaf Spot", "Corn Healthy",
    "Grape Black Rot", "Grape Esca", "Grape Leaf Blight", "Grape Healthy",
    "Potato Early Blight", "Potato Late Blight", "Potato Healthy",
    "Tomato Bacterial Spot", "Tomato Early Blight", "Tomato Late Blight", "Tomato Healthy"
]

class DiseaseDetector:
    def __init__(self, model_path=None):
        if not TORCH_AVAILABLE:
            self.model = None
            return

        # Initialize MobileNetV2
        self.model = mobilenet_v2(pretrained=True)
        # Modify the classifier to match our number of classes
        num_ftrs = self.model.classifier[1].in_features
        self.model.classifier[1] = torch.nn.Linear(num_ftrs, len(DISEASE_CLASSES))
        
        if model_path and os.path.exists(model_path):
            self.model.load_state_dict(torch.load(model_path, map_location='cpu'))
        
        self.model.eval()
        
        # Standard transforms for MobileNet
        self.transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

    def predict(self, image_bytes):
        if not TORCH_AVAILABLE:
            # Mock prediction
            mock_class = random.choice(DISEASE_CLASSES)
            return {
                "disease": mock_class,
                "confidence": 0.85 + random.random() * 0.14,
                "recommendation": self.get_recommendation(mock_class),
                "is_mock": True
            }

        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        input_tensor = self.transform(image).unsqueeze(0)
        
        with torch.no_grad():
            outputs = self.model(input_tensor)
            _, predicted = torch.max(outputs, 1)
            confidence = torch.nn.functional.softmax(outputs, dim=1)[0][predicted].item()
            
        class_name = DISEASE_CLASSES[predicted.item()]
        return {
            "disease": class_name,
            "confidence": round(confidence, 4),
            "recommendation": self.get_recommendation(class_name)
        }

    def get_recommendation(self, disease):
        # Basic recommendation mapping
        recommendations = {
            "Potato Early Blight": "Use fungicides containing chlorothalonil or mancozeb. Rotate crops.",
            "Potato Late Blight": "Destroy infected plants immediately. Use copper-based fungicides.",
            "Tomato Early Blight": "Remove lower leaves. Apply fungicides like Neem oil or sulfur.",
            "Apple Scab": "Prune trees to improve air circulation. Use sulfur-based sprays.",
            "Healthy": "Continue regular monitoring and balanced fertilization."
        }
        return recommendations.get(disease, "Consult a local agricultural expert for treatment options.")

# Global instance
detector = DiseaseDetector()

def detect_disease(image_bytes):
    return detector.predict(image_bytes)

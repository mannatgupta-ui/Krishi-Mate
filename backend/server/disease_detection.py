import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model, Model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import io
import os
import logging

logger = logging.getLogger(__name__)

# Constants
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "plant_disease_efficientnetv2b2.keras")
# These classes must match exactly the folder names in backend/dataset/train
# We try to load them from the JSON file generated during training.
DISEASE_CLASSES = []
CLASS_INDICES_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "disease_class_indices.json")

def load_class_indices():
    global DISEASE_CLASSES
    if os.path.exists(CLASS_INDICES_PATH):
        try:
            with open(CLASS_INDICES_PATH, 'r') as f:
                indices = json.load(f)
                # indices is { "ClassName": 0, "AnotherClass": 1 }
                # We need a list where list[0] == "ClassName"
                sorted_classes = sorted(indices.items(), key=lambda x: x[1])
                DISEASE_CLASSES = [item[0] for item in sorted_classes]
                logger.info(f"Loaded {len(DISEASE_CLASSES)} disease classes from metadata.")
        except Exception as e:
            logger.error(f"Error loading disease class indices: {e}")

# Initial load attempt
load_class_indices()

# Fallback hardcoded list if file not found (matches standard PlantVillage)
if not DISEASE_CLASSES:
    DISEASE_CLASSES = [
    "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
    "Blueberry___healthy", "Cherry_(including_sour)___Powdery_mildew", "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", "Corn_(maize)___Common_rust_", "Corn_(maize)___Northern_Leaf_Blight", "Corn_(maize)___healthy",
    "Grape___Black_rot", "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot", "Peach___healthy",
    "Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy",
    "Potato___Early_blight", "Potato___Late_blight", "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch", "Strawberry___healthy",
    "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight", "Tomato___Leaf_Mold", 
    "Tomato___Septoria_leaf_spot", "Tomato___Spider_mites Two-spotted_spider_mite", "Tomato___Target_Spot", 
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "Tomato___Tomato_mosaic_virus", "Tomato___healthy"
]

_model = None

def get_model():
    global _model
    if _model is None:
        if os.path.exists(MODEL_PATH):
            try:
                _model = load_model(MODEL_PATH)
                logger.info(f"Disease detection model loaded from {MODEL_PATH}")
            except Exception as e:
                logger.error(f"Failed to load model: {e}")
        else:
            logger.warning(f"Model file not found at {MODEL_PATH}")
    return _model

def get_recommendation(disease_name):
    # Map disease names to simple recommendations
    recommendations = {
        "Apple___Apple_scab": "Use fungicides like Captan or Sulfur. Prune infected branches.",
        "Apple___Black_rot": "Remove infected fruit and wood. Apply fungicides.",
        "Apple___Cedar_apple_rust": "Remove nearby juniper plants. Use resistant varieties.",
        "Apple___healthy": "Your apple plant looks healthy! Keep up the good work.",
        "Corn_(maize)___Common_rust_": "Plant resistant hybrids. Apply fungicides early.",
        "Corn_(maize)___Northern_Leaf_Blight": "Use resistant hybrids. Rotate crops.",
        "Corn_(maize)___healthy": "Corn plant is healthy.",
        "Grape___Black_rot": "Remove mummified fruit. Apply fungicides.",
        "Grape___Esca_(Black_Measles)": "Prune infected vines. No cure, manage spread.",
        "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": "Apply fungicides. Improve air circulation.",
        "Grape___healthy": "Grape vine is healthy.",
        "Potato___Early_blight": "Apply chlorothalonil or mancozeb. Rotate crops.",
        "Potato___Late_blight": "Destroy infected plants. Use copper-based fungicides.",
        "Potato___healthy": "Potato plant is healthy.",
        "Tomato___Bacterial_spot": "Use copper sprays. Avoid overhead watering.",
        "Tomato___Early_blight": "Mulch soil. Apply fungicides.",
        "Tomato___Late_blight": "Remove infected plants. Use fungicides.",
        "Tomato___healthy": "Tomato plant is healthy."
    }
    # Default message
    base_name = disease_name.split("___")[-1].replace("_", " ")
    return recommendations.get(disease_name, f"Detected {base_name}. Consult an expert for specific treatment.")

def detect_disease(image_bytes):
    model = get_model()
    if model is None:
        return {"error": "Model not loaded. Please train the model first."}

    try:
        # Preprocess image
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        image = image.resize((224, 224))
        img_array = img_to_array(image)
        img_array = np.expand_dims(img_array, axis=0)
        # EfficientNetV2 expects [0, 255] range, so we do NOT divide by 255.0
        # img_array = img_array / 255.0
        # img_array = img_array / 255.0

        # Predict
        predictions = model.predict(img_array)
        predicted_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_idx])
        
        # We need to ensure we don't crash if index out of bounds, 
        # but for now we assume consistent classes.
        # Ideally we read class_indices from training.
        
        # NOTE: If the training script produces different classes, this mapping will be wrong.
        # We will add a fallback or update this after checking training output.
        if predicted_idx < len(DISEASE_CLASSES):
            predicted_label = DISEASE_CLASSES[predicted_idx]
        else:
            predicted_label = f"Class_{predicted_idx}"

        return {
            "disease": predicted_label.replace("___", " - ").replace("_", " "),
            "confidence": round(confidence, 4),
            "recommendation": get_recommendation(predicted_label)
        }

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return {"error": str(e)}

import pickle
import pandas as pd
import json
import os
import logging

logger = logging.getLogger(__name__)

# Constants
MODEL_FILE = "yield_model.pkl"
ENCODERS_FILE = "yield_encoders.pkl"
METADATA_FILE = "yield_metadata.json"

_model = None
_encoders = None
_metadata = None

def load_artifacts():
    global _model, _encoders, _metadata
    try:
        if os.path.exists(MODEL_FILE):
            with open(MODEL_FILE, 'rb') as f:
                _model = pickle.load(f)
        
        if os.path.exists(ENCODERS_FILE):
            with open(ENCODERS_FILE, 'rb') as f:
                _encoders = pickle.load(f)
        
        if os.path.exists(METADATA_FILE):
            with open(METADATA_FILE, 'r') as f:
                _metadata = json.load(f)
                
        if _model and _encoders and _metadata:
            logger.info("Yield prediction artifacts loaded successfully.")
        else:
            logger.warning("Yield prediction artifacts not found. Run train_yield_model.py first.")
            
    except Exception as e:
        logger.error(f"Error loading yield prediction artifacts: {e}")

# Load on import (or handle in function)
load_artifacts()

def get_yield_metadata():
    if _metadata is None:
        load_artifacts()
    return _metadata

def predict_yield(state, district, crop, season, area):
    if _model is None or _encoders is None:
        load_artifacts()
        if _model is None:
            raise Exception("Model not loaded. Please train the model first.")

    try:
        # Prepare input
        input_data = pd.DataFrame({
            'State': [state.strip().upper()],
            'District': [district.strip().upper()],
            'Season': [season.strip().upper()],
            'Crop': [crop.strip().upper()],
            'Area': [area] # Area is numerical, no encoding needed for it directly, but used as feature
        })

        # Encode categorical features
        # Note: We need to handle unseen labels gracefully? 
        # For now, we assume user selects from dropdowns which are populated from metadata.
        # But if they send something else, it might crash.
        
        le_state = _encoders['State']
        le_district = _encoders['District']
        le_season = _encoders['Season']
        le_crop = _encoders['Crop']

        # Transform
        input_data['State_Encoded'] = le_state.transform(input_data['State'])
        input_data['District_Encoded'] = le_district.transform(input_data['District'])
        input_data['Season_Encoded'] = le_season.transform(input_data['Season'])
        input_data['Crop_Encoded'] = le_crop.transform(input_data['Crop'])

        # Select features in correct order
        features = ['State_Encoded', 'District_Encoded', 'Season_Encoded', 'Crop_Encoded', 'Area']
        X = input_data[features]

        # Predict
        predicted_yield = _model.predict(X)[0]
        
        # We trained on Yield (Production/Area) or Production?
        # In my training script: I targeted 'Yield' = Production / Area.
        # So the output is Yield per unit area.
        
        total_production = predicted_yield * area
        
        return {
            "predicted_yield": float(predicted_yield),
            "predicted_production": float(total_production)
        }

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise e

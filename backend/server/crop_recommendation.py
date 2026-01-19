import os
import pandas as pd
import pickle
import warnings
try:
    from .weather import fetch_weather
    from .soil_data import get_district_soil_health
except ImportError:
    from weather import fetch_weather
    from soil_data import get_district_soil_health

warnings.filterwarnings("ignore")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "crop_recommendation_model.pkl")
LE_PATH = os.path.join(BASE_DIR, "crop_le.pkl")
RAINFALL_PATH = os.path.join(BASE_DIR, "District_Rainfall_Normal_0.csv")

# Global variables to store model and label encoder
_model = None
_le = None
_rainfall_df = None

def _load_resources():
    global _model, _le, _rainfall_df
    if _model is None:
        try:
            with open(MODEL_PATH, 'rb') as f:
                _model = pickle.load(f)
            with open(LE_PATH, 'rb') as f:
                _le = pickle.load(f)
            _rainfall_df = pd.read_csv(RAINFALL_PATH)
        except Exception as e:
            print(f"Error loading model resources: {e}")

def get_district_rainfall(state, district):
    """Fetches normal annual rainfall for a district from the CSV."""
    _load_resources()
    if _rainfall_df is None:
        return 100.0 # Fallback
    
    # Normalize inputs to match CSV (usually UPPERCASE)
    state_upper = state.strip().upper()
    district_upper = district.strip().upper()
    
    # Try exact match
    match = _rainfall_df[
        (_rainfall_df['STATE/UT'].str.upper() == state_upper) & 
        (_rainfall_df['DISTRICT'].str.upper() == district_upper)
    ]
    
    if not match.empty:
        return float(match.iloc[0]['ANNUAL'])
    
    # Fallback to state average if district not found
    state_match = _rainfall_df[_rainfall_df['STATE/UT'].str.upper() == state_upper]
    if not state_match.empty:
        return float(state_match['ANNUAL'].mean())
    
    return 1000.0 # National average fallback

CROP_SYMBOLS = {
    "rice": "🌾",
    "maize": "🌽",
    "chickpea": "🫘",
    "kidneybeans": "🫘",
    "pigeonpeas": "🫘",
    "mothbeans": "🫘",
    "mungbean": "🫘",
    "blackgram": "🫘",
    "lentil": "🫘",
    "pomegranate": "🍎",
    "banana": "🍌",
    "mango": "🥭",
    "grapes": "🍇",
    "watermelon": "🍉",
    "muskmelon": "🍈",
    "apple": "🍎",
    "orange": "🍊",
    "papaya": "🥭",
    "coconut": "🥥",
    "cotton": "☁️",
    "jute": "🌿",
    "coffee": "☕"
}

def predict_crop_recommendation(state, district, n=None, p=None, k=None):
    """
    Complete pipeline:
    1. Fetch real-time Temp/Humidity from weather API.
    2. Fetch pH and NPK from soil_data extraction mapping (Google Research logic).
    3. Fetch Rainfall from historical dataset.
    4. Run ML model (RandomForest).
    """
    _load_resources()
    if _model is None:
        return {"error": "Model not loaded"}

    # 1. Fetch real-time weather data
    try:
        # We use district as location for weather
        _, weather_meta = fetch_weather(district)
        temperature = float(weather_meta['temperature'])
        humidity = float(weather_meta['humidity'])
    except Exception as e:
        print(f"Weather API failed, using fallbacks: {e}")
        temperature = 25.0
        humidity = 70.0

    # 2. Fetch Soil Data (pH, N, P, K)
    soil_stats = get_district_soil_health(state, district)
    ph = soil_stats["ph"]
    n = n if n is not None else soil_stats["N"]
    p = p if p is not None else soil_stats["P"]
    k = k if k is not None else soil_stats["K"]

    # 3. Fetch Rainfall
    rainfall = get_district_rainfall(state, district)

    # 4. Prepare input for model
    # Features: ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    input_data = pd.DataFrame([[n, p, k, temperature, humidity, ph, rainfall]],
                              columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])

    # 5. Predict Probabilities
    probs = _model.predict_proba(input_data)[0]
    top_indices = probs.argsort()[-3:][::-1]
    
    recommendations = []
    for idx in top_indices:
        crop_name = _le.inverse_transform([idx])[0]
        confidence = float(probs[idx])
        symbol = CROP_SYMBOLS.get(crop_name.lower(), "🌱")
        recommendations.append({
            "crop": crop_name.title(),
            "symbol": symbol,
            "confidence": round(confidence * 100, 2)
        })

    return {
        "top_recommendations": recommendations,
        "details": {
            "temperature": temperature,
            "humidity": humidity,
            "ph": ph,
            "rainfall": rainfall,
            "npk": [n, p, k]
        }
    }

if __name__ == "__main__":
    # Test cases
    test_state = "Maharashtra"
    test_district = "Pune"
    res = predict_crop_recommendation(test_state, test_district, 90, 40, 40)
    print(f"Recommendation for {test_district}, {test_state}:")
    print(res)

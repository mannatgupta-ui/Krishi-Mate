import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import pickle
import os

class FertilizerAdvisor:
    def __init__(self, data_path="Fertilizer_Prediction.csv"):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.le_crop = LabelEncoder()
        self.le_soil = LabelEncoder()
        self.le_fert = LabelEncoder()
        
        if os.path.exists(data_path):
            self.train(data_path)

    def train(self, data_path):
        df = pd.read_csv(data_path)
        
        # Preprocessing
        # Typical columns: ['Temparature', 'Humidity ', 'Moisture', 'Soil Type', 'Crop Type', 'Nitrogen', 'Potassium', 'Phosphorous', 'Fertilizer Name']
        # Note: CSV headers sometimes have spaces
        df.columns = [c.strip() for c in df.columns]
        
        X = df.drop('Fertilizer Name', axis=1)
        y = df['Fertilizer Name']
        
        X['Soil Type'] = self.le_soil.fit_transform(X['Soil Type'])
        X['Crop Type'] = self.le_crop.fit_transform(X['Crop Type'])
        y_encoded = self.le_fert.fit_transform(y)
        
        self.model.fit(X, y_encoded)
        print("Fertilizer Advisor trained successfully.")

    def predict(self, data: dict):
        # Input: {'temp': 30, 'hum': 80, 'moist': 40, 'soil': 'Loomy', 'crop': 'Rice', 'N': 40, 'P': 40, 'K': 40}
        try:
            soil_enc = self.le_soil.transform([data['soil']])[0]
            crop_enc = self.le_crop.transform([data['crop']])[0]
            
            input_data = np.array([[
                data['temp'], data['hum'], data['moist'], 
                soil_enc, crop_enc, 
                data['N'], data['P'], data['K']
            ]])
            
            pred_idx = self.model.predict(input_data)[0]
            return self.le_fert.inverse_transform([pred_idx])[0]
        except Exception as e:
            print(f"Prediction error: {e}")
            return "General NPK 19-19-19" # Default fallback

# Global instance
advisor = FertilizerAdvisor()

def recommend_fertilizer(data):
    return advisor.predict(data)

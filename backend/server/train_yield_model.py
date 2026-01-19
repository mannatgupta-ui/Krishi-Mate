import pandas as pd
import numpy as np
import pickle
import json
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, r2_score

# Constants
CSV_FILE = "APY.csv"
MODEL_FILE = "yield_model.pkl"
ENCODERS_FILE = "yield_encoders.pkl"
METADATA_FILE = "yield_metadata.json"

def train_model():
    print("Loading dataset...")
    if not os.path.exists(CSV_FILE):
        print(f"Error: {CSV_FILE} not found!")
        return

    df = pd.read_csv(CSV_FILE)
    
    # Clean Column Names
    df.columns = df.columns.str.strip()
    
    # Drop rows with missing values
    df = df.dropna()

    # Filter out rows where Area is 0 or missing to avoid division by zero or bad data
    df = df[df['Area'] > 0]

    # Calculate Yield if not present or just to be sure (Production / Area)
    # Note: Some datasets might have yield directly. 
    # Use Production/Area as target or Yield if available.
    # The reference APY.csv usually has State, District, Crop, Season, Year, Area, Production.
    # We want to predict Yield (Production/Area) or Production. 
    # Usually Yield is better normalized.
    if 'Yield' not in df.columns:
        df['Yield'] = df['Production'] / df['Area']

    # Select Features and Target
    # Features: State, District, Crop, Season, Area
    # Target: Yield (or Production, but Yield is requested)
    
    # Clean string columns
    str_cols = ['State', 'District', 'Crop', 'Season']
    for col in str_cols:
        df[col] = df[col].astype(str).str.strip().str.upper()

    # Initialize Encoders
    le_state = LabelEncoder()
    le_district = LabelEncoder()
    le_crop = LabelEncoder()
    le_season = LabelEncoder()

    print("Encoding features...")
    df['State_Encoded'] = le_state.fit_transform(df['State'])
    df['District_Encoded'] = le_district.fit_transform(df['District'])
    df['Crop_Encoded'] = le_crop.fit_transform(df['Crop'])
    df['Season_Encoded'] = le_season.fit_transform(df['Season'])

    features = ['State_Encoded', 'District_Encoded', 'Season_Encoded', 'Crop_Encoded', 'Area']
    target = 'Production' # Let's predict Production, then we can show Yield = PredictedProduction / Area

    # Alternatively, predict Yield directly.
    # Let's predict Yield directly as it's more standard for these tasks.
    target_yield = 'Yield'

    X = df[features]
    y = df[target_yield]

    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training Random Forest Regressor (this may take a while for high accuracy)...")
    # n_estimators=100 is standard, increasing to 200 for 'high accuracy' request
    model = RandomForestRegressor(n_estimators=150, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    print("Evaluating model...")
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print(f"Model Performance: MAE={mae:.4f}, R2 Score={r2:.4f}")

    print("Saving model and artifacts...")
    
    # Save Model
    with open(MODEL_FILE, 'wb') as f:
        pickle.dump(model, f)

    # Save Encoders
    encoders = {
        'State': le_state,
        'District': le_district,
        'Crop': le_crop,
        'Season': le_season
    }
    with open(ENCODERS_FILE, 'wb') as f:
        pickle.dump(encoders, f)

    # Save Metadata for Frontend Dropdowns
    metadata = {
        'states': sorted(le_state.classes_.tolist()),
        'districts': sorted(le_district.classes_.tolist()),
        'crops': sorted(le_crop.classes_.tolist()),
        'seasons': sorted(le_season.classes_.tolist())
    }
    # Create mapping of State -> Districts for cascading dropdowns
    state_district_map = {}
    for state in metadata['states']:
        districts = df[df['State'] == state]['District'].unique().tolist()
        state_district_map[state] = sorted(districts)
    
    metadata['state_district_map'] = state_district_map

    with open(METADATA_FILE, 'w') as f:
        json.dump(metadata, f, indent=4)

    print("Training complete. Artifacts saved.")

if __name__ == "__main__":
    train_model()

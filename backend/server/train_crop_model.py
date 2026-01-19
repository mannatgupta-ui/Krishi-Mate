import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder

# Load dataset
data_path = "backend/server/Crop_recommendation.csv"
df = pd.read_csv(data_path)

# Features and target
X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = df['label']

# Encode target labels
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

print("Training RandomForestClassifier...")
# RandomForest usually gets ~99% accuracy on this dataset
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Evaluation
y_pred = rf_model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy * 100:.2f}%")

if accuracy < 0.95:
    print("⚠️ Warning: Accuracy is below 95%. Consider tuning or using another model.")
else:
    print("✅ Target accuracy achieved!")

print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=le.classes_))

# Save model and label encoder
model_path = "backend/server/crop_recommendation_model.pkl"
le_path = "backend/server/crop_le.pkl"

with open(model_path, 'wb') as f:
    pickle.dump(rf_model, f)
with open(le_path, 'wb') as f:
    pickle.dump(le, f)

print(f"✅ Model saved to {model_path}")
print(f"✅ Label encoder saved to {le_path}")

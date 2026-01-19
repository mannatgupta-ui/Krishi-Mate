import requests
import os

url = "https://raw.githubusercontent.com/gabbygab1233/Crop-Recommender/main/Crop_recommendation.csv"
target_path = r"c:\Users\manna\OneDrive\Desktop\Krishi-Mate\backend\server\Crop_recommendation.csv"

try:
    print(f"Downloading from {url}...")
    response = requests.get(url)
    response.raise_for_status()
    with open(target_path, "wb") as f:
        f.write(response.content)
    print(f"✅ Downloaded successfully to {target_path}")
except Exception as e:
    print(f"❌ Error downloading: {e}")

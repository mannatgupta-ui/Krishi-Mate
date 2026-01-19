# weather.py (Updated Version)
import os
from dotenv import load_dotenv
import requests

load_dotenv()
API_KEY = os.getenv("WEATHER_API_KEY")
if not API_KEY:
    raise ValueError("OpenWeatherMap API key not found. Make sure it's set as an environment variable named WEATHER_API_KEY.")

def fetch_weather(location: str):
    """
    Fetches current weather info and returns it in two formats:
    1. A doc/meta pair for the vector DB.
    2. A structured dictionary for the weather analysis component.
    """
    url = f"http://api.openweathermap.org/data/2.5/weather?q={location}&appid={API_KEY}&units=metric"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        # --- Extract all necessary data ---
        temperature = data['main']['temp']
        humidity = data['main']['humidity']
        rainfall = data.get('rain', {}).get('1h', 0)
        # --- NEW: Get wind speed and condition ---
        wind_speed_ms = data['wind']['speed'] # Speed in meter/sec
        condition = data['weather'][0]['main']

        # --- Format 1: For the vector database (build_db.py) ---
        weather_doc = (
            f"Weather update for {location}: "
            f"Temperature {temperature}°C | Humidity {humidity}% | Rainfall {rainfall} mm"
        )
        weather_meta = {
            "location": location,
            "temperature": str(temperature),
            "humidity": str(humidity),
            "rainfall": str(rainfall)
        }

        # --- Format 2: For the frontend WeatherAnalysis component ---
        current_weather_dict = {
            "temperature": round(temperature),
            "humidity": humidity,
            "rainfall": rainfall,
            "windSpeed": int(wind_speed_ms * 3.6), # Convert to km/h
            "condition": condition
        }

        return weather_doc, weather_meta, current_weather_dict

    except requests.exceptions.RequestException as e:
        print(f"❌ WEATHER ERROR - Status Code: {response.status_code}")
        print(f"❌ WEATHER ERROR - Response: {response.text}")
        raise e
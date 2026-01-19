# weather_api.py
import requests
from datetime import datetime

def weathercode_to_condition(code: int) -> str:
    """Converts WMO weather codes from Open-Meteo into simple condition strings."""
    if code in [0, 1]:
        return "Clear"
    if code in [2, 3]:
        return "Clouds"
    if code in [45, 48]:
        return "Fog"
    if code in [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82]:
        return "Rain"
    if code in [71, 73, 75, 77, 85, 86]:
        return "Snow"
    if code in [95, 96, 99]:
        return "Thunderstorm"
    return "Clear" # Default

def get_open_meteo_forecast(location: str):
    """
    Fetches a real 7-day forecast using the free Open-Meteo API.
    """
    # --- THIS IS THE FIX ---
    # Simplify the location to just the primary name (e.g., "Bhopal")
    simple_location = location.split(',')[0].strip()
    # --- END OF FIX ---

    # Step 1: Geocode the simplified location to get latitude and longitude
    geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={simple_location}&count=1&language=en&format=json"
    geo_response = requests.get(geo_url)
    geo_response.raise_for_status()
    geo_data = geo_response.json()

    # The API response might not have 'results', especially if no location is found
    if "results" not in geo_data:
        raise ValueError(f"Could not find coordinates for location: {location}")

    lat = geo_data['results'][0]['latitude']
    lon = geo_data['results'][0]['longitude']

    # Step 2: Use lat/lon to get the 7-day forecast
    forecast_url = (
        f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}"
        "&daily=weathercode,temperature_2m_max,precipitation_sum"
        "&current=temperature_2m,relativehumidity_2m,rain,windspeed_10m"
        "&timezone=auto"
    )
    forecast_response = requests.get(forecast_url)
    forecast_response.raise_for_status()
    data = forecast_response.json()

    # Step 3: Process the API response into the format our app needs
    current = data['current']
    current_weather = {
        "temperature": round(current['temperature_2m']),
        "humidity": current['relativehumidity_2m'],
        "rainfall": current['rain'],
        "windSpeed": int(current['windspeed_10m']),
        "condition": weathercode_to_condition(data['daily']['weathercode'][0])
    }

    daily = data['daily']
    forecast_data = []
    for i in range(7):
        forecast_data.append({
            "day": datetime.fromisoformat(daily['time'][i]).strftime('%a'),
            "temp": round(daily['temperature_2m_max'][i]),
            "rain": round(daily['precipitation_sum'][i], 1),
            "condition": weathercode_to_condition(daily['weathercode'][i])
        })

    return current_weather, forecast_data
# analysis.py (Final Polished Version)
import os
import logging
import json
import re
from typing import Dict, Any, List
from dotenv import load_dotenv

from chatbot2 import query_openrouter
from weather_api import get_open_meteo_forecast

load_dotenv()
logger = logging.getLogger(__name__)

def get_weather_analysis(location: str, crop: str) -> Dict[str, Any]:
    """
    Generates a weather dashboard and structured AI insights.
    """
    try:
        # 1. Get real weather data
        current_weather, forecast_data = get_open_meteo_forecast(location)

        # 2. Create the detailed weather summary
        weather_summary = f"The current weather is {current_weather['temperature']}°C with {current_weather['humidity']}% humidity. The 7-day forecast shows temperatures ranging from {min([d['temp'] for d in forecast_data]):.1f}°C to {max([d['temp'] for d in forecast_data]):.1f}°C."
        
        # 3. Use the LLM to generate AI-powered insights
        system_prompt = """You are an expert agronomist. 
        Your task is to generate exactly 3 actionable insights based on the weather data.
        
        CRITICAL: You must return the result as a VALID JSON ARRAY of objects. 
        Do not include markdown formatting (like ```json). Just the raw JSON array.
        
        Each object must have exactly these fields:
        - "type": one of "warning", "info", or "success"
        - "message": A clear, descriptive headline (e.g., "High Risk of Fungal Infection").
        - "action": A DETAILED recommendation (2-3 sentences) explaining exactly what steps the farmer should take and why. Be specific about treatments or cultural practices.
        
        Example format:
        [
            {"type": "warning", "message": "High Fungal Disease Risk", "action": "Due to high humidity, there is a risk of rust. Apply Propiconazole (Tilt) @ 1ml/liter immediately and ensure good drainage in the field to prevent water stagnation."},
            {"type": "info", "message": "Ideal Sowing Conditions", "action": "The current temperature window of 20-25°C is perfect for sowing. Complete sowing within the next 3 days to maximize germination rates."}
        ]"""
        
        user_prompt = f"""
        Weather Data for {location}:
        {weather_summary}
        
        Crop: {crop}
        
        Generate 3 structured insights now.
        """
        
        messages = [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}]
        response = query_openrouter(messages)
        raw_content = response["choices"][0]["message"]["content"]
        
        print(f"--- RAW AI RESPONSE ---\n{raw_content}\n-----------------------")

        # 4. Parse the JSON response
        insights = []
        try:
            # Clean up potential markdown code blocks if the LLM ignores instructions
            cleaned_content = raw_content.strip()
            if cleaned_content.startswith("```json"):
                cleaned_content = cleaned_content[7:]
            if cleaned_content.endswith("```"):
                cleaned_content = cleaned_content[:-3]
            
            insights = json.loads(cleaned_content.strip())
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse LLM JSON: {e}")
            # Fallback logic if parsing strictly fails (could add regex parsing here if needed)
            insights = [
                {"type": "info", "message": "Weather analysis available", "action": "Check detailed forecast above."}
            ]

        # 5. Return structured data
        return {
            "currentWeather": current_weather,
            "forecast": forecast_data,
            "insights": insights[:3] 
        }

    except Exception as e:
        logger.error(f"Error getting weather analysis: {e}")
        return {
            "currentWeather": {"temperature": 0, "humidity": 0, "rainfall": 0, "windSpeed": 0, "condition": "Error"},
            "forecast": [],
            "insights": [{"type": "warning", "message": "Could not fetch weather data.", "action": "Please try again later."}]
        }
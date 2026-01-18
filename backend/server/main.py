import os
import logging
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.concurrency import run_in_threadpool

# Import our logic functions
from chatbot2 import get_bot_response
from recommendations import get_crop_recommendations
from analysis import get_weather_analysis
from market_rates import fetch_market_rates
from disease_detection import detect_disease
from database import SessionLocal, Farmer, SensorReading, init_db

# Initialize Database
init_db()

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Pydantic Models ---

# Models for Chatbot
class ChatRequest(BaseModel):
    message: str
    location: str

class ChatResponse(BaseModel):
    reply: str

# Models for Crop Recommendation
class LocationRequest(BaseModel):
    district: str
    state: Optional[str] = None

class CropData(BaseModel):
    name: str
    reason: str
    favorability: str

class CropRecommendationResponse(BaseModel):
    favorable: List[CropData]
    unfavorable: List[CropData]

# Models for Weather Analysis
class WeatherAnalysisRequest(BaseModel):
    location: str
    crop: str

class CurrentWeather(BaseModel):
    temperature: float
    humidity: float
    rainfall: float
    windSpeed: int
    condition: str

class ForecastDay(BaseModel):
    day: str
    temp: float
    rain: float
    condition: str

class Insight(BaseModel):
    type: str
    message: str
    action: str

class WeatherAnalysisResponse(BaseModel):
    currentWeather: CurrentWeather
    forecast: List[ForecastDay]
    insights: List[Insight]

# Models for Market Rates
class MarketRateRequest(BaseModel):
    commodity: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None

class MarketRecord(BaseModel):
    state: str
    district: str
    market: str
    commodity: str
    variety: str
    grade: str
    arrival_date: str
    min_price: str
    max_price: str
    modal_price: str

# Models for Farmer and Sensors
class FarmerCreate(BaseModel):
    name: str
    location: str
    land_area: float
    primary_crop: str

class SensorReadingCreate(BaseModel):
    farmer_id: int
    soil_moisture: float
    ph_level: float
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float

# --- FastAPI Application ---
app = FastAPI(title="CropWeather AI API")

# CORS middleware
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8080",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---

@app.get("/")
def home():
    return {"message": "Server is running"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Endpoint to handle chatbot conversations."""
    try:
        reply = await run_in_threadpool(
            get_bot_response, user_query=request.message, location=request.location
        )
        return ChatResponse(reply=reply)
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing your chat request.")

@app.post("/api/crop-recommendations", response_model=CropRecommendationResponse)
async def crop_recommendations(request: LocationRequest):
    """Endpoint to get crop recommendations for a location."""
    try:
        recommendations = await run_in_threadpool(
            get_crop_recommendations, district=request.district, state=request.state
        )
        return CropRecommendationResponse(**recommendations)
    except Exception as e:
        logger.error(f"Crop recommendation endpoint error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching crop recommendations.")

@app.post("/api/weather-analysis", response_model=WeatherAnalysisResponse)
async def weather_analysis(request: WeatherAnalysisRequest):
    """Endpoint for the main weather analysis dashboard."""
    try:
        analysis_data = await run_in_threadpool(
            get_weather_analysis, location=request.location, crop=request.crop
        )
        return WeatherAnalysisResponse(**analysis_data)
    except Exception as e:
        logger.error(f"Weather analysis endpoint error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while generating the weather analysis.")

@app.post("/api/market-rates", response_model=List[MarketRecord])
async def market_rates(request: MarketRateRequest):
    """Endpoint to fetch live market rates."""
    try:
        records = await run_in_threadpool(
            fetch_market_rates, 
            commodity=request.commodity, 
            state=request.state, 
            district=request.district
        )
        return records
    except Exception as e:
        logger.error(f"Market rates endpoint error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching market rates.")

@app.post("/api/detect-disease")
async def disease_detection_endpoint(file: UploadFile = File(...)):
    """Endpoint to detect plant diseases from an image."""
    try:
        contents = await file.read()
        result = await run_in_threadpool(detect_disease, image_bytes=contents)
        return result
    except Exception as e:
        logger.error(f"Disease detection endpoint error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred during disease detection.")

# --- Farmer & Sensor Data Endpoints ---

@app.post("/api/farmers")
async def create_farmer(farmer: FarmerCreate):
    db = SessionLocal()
    try:
        new_farmer = Farmer(**farmer.dict())
        db.add(new_farmer)
        db.commit()
        db.refresh(new_farmer)
        return new_farmer
    finally:
        db.close()

@app.get("/api/farmers/{farmer_id}/sensors")
async def get_sensor_data(farmer_id: int):
    db = SessionLocal()
    try:
        readings = db.query(SensorReading).filter(SensorReading.farmer_id == farmer_id).order_by(SensorReading.timestamp.desc()).limit(20).all()
        return readings
    finally:
        db.close()

@app.post("/api/sensors")
async def add_sensor_reading(reading: SensorReadingCreate):
    db = SessionLocal()
    try:
        new_reading = SensorReading(**reading.dict())
        db.add(new_reading)
        db.commit()
        db.refresh(new_reading)
        return new_reading
    finally:
        db.close()


if __name__ == '__main__':
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    logger.info(f"Starting server on port {port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port, log_level="info", reload=True)
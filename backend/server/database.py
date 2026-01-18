from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime

Base = declarative_base()

class Farmer(Base):
    __tablename__ = 'farmers'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    location = Column(String(100))
    land_area = Column(Float)  # in acres
    primary_crop = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    sensors = relationship("SensorReading", back_populates="farmer")

class SensorReading(Base):
    __tablename__ = 'sensor_readings'
    id = Column(Integer, primary_key=True)
    farmer_id = Column(Integer, ForeignKey('farmers.id'))
    soil_moisture = Column(Float)
    ph_level = Column(Float)
    nitrogen = Column(Float)
    phosphorus = Column(Float)
    potassium = Column(Float)
    temperature = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    farmer = relationship("Farmer", back_populates="sensors")

# Database setup
DATABASE_URL = "sqlite:///./farming_vault.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
    print("Database initialized.")

if __name__ == "__main__":
    init_db()

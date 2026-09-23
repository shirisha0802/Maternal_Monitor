from sqlalchemy import Column, Integer, String, Float, JSON, DateTime
from database import Base
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)

class MaternalAssessment(Base):
    __tablename__ = "maternal_assessments"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user_id = Column(Integer, nullable=False)

    age = Column(Integer, nullable=False)
    systolicBP = Column(Integer, nullable=False)
    diastolicBP = Column(Integer, nullable=False)
    BS = Column(Float, nullable=False)
    bodyTemp = Column(Float, nullable=False)
    heartRate = Column(Integer, nullable=False)

    bmi = Column(Float, nullable=False)
    hb = Column(Float, nullable=False)
    dietScore = Column(Float, nullable=False)
    protein_g = Column(Float, nullable=False)
    calcium_mg = Column(Float, nullable=False)
    iron_mg = Column(Float, nullable=False)

    risk_class = Column(Integer, nullable=False)
    high_risk_probability = Column(Float, nullable=False)

    deficiency_type = Column(String, nullable=False)
    nutrient_confidence = Column(Float, nullable=False)
    recommended_foods = Column(JSON, nullable=False) #makes it easier to store and retrieve the list of recommended foods as a JSON array 
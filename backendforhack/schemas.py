from pydantic import BaseModel, Field
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

class LoginResponse(BaseModel):
    message: str
    access_token: str

class MaternalAssessmentCreate(BaseModel):
    age: int = Field(..., ge=1)
    systolicBP: int = Field(..., ge=1)
    diastolicBP: int = Field(..., ge=1)
    BS: float = Field(..., ge=0)
    bodyTemp: float = Field(..., ge=0)
    heartRate: int = Field(..., ge=0)

    bmi: float = Field(..., ge=0)
    hb: float = Field(..., ge=0)
    dietScore: float = Field(..., ge=0)
    protein_g: float = Field(..., ge=0)
    calcium_mg: float = Field(..., ge=0)
    iron_mg: float = Field(..., ge=0)

class MaternalAssessmentResponse(BaseModel):
    id: int
    user_id: int
    created_at: datetime

    age: int
    systolicBP: int
    diastolicBP: int
    BS: float
    bodyTemp: float
    heartRate: int

    bmi: float
    hb: float
    dietScore: float
    protein_g: float
    calcium_mg: float
    iron_mg: float

    risk_class: int
    high_risk_probability: float

    deficiency_type: str
    nutrient_confidence: float
    recommended_foods: list[str]
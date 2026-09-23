from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from jose import JWTError

from security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)

from database import get_db
from models import User, MaternalAssessment
from schemas import (
    UserCreate,
    UserLogin,
    MaternalAssessmentCreate,
    MaternalAssessmentResponse,
    UserResponse,
    LoginResponse
)

from model_loader import predict_risk, predict_nutrients
from recommendation import recommend_food


authorization_header = APIKeyHeader(name="Authorization")

app = FastAPI(title="Maternal Health AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://maternal-monitor.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_current_user(
    authorization: str = Depends(authorization_header),
    db: Session = Depends(get_db)
):

    try:
        parts = authorization.split(" ")

        if len(parts) != 2 or parts[0] != "Bearer":
            raise HTTPException(
                status_code=401,
                detail="Invalid authorization header"
            )

        token = parts[1]
        payload = decode_access_token(token)
        user_id = int(payload["sub"])

    except (JWTError, KeyError, ValueError):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user


# Home endpoint
@app.get("/")
def home():
    return {"message": "Maternal Health Backend Running "}



# User signup endpoint
@app.post("/signup", status_code=201)
def signup(user: UserCreate, db: Session = Depends(get_db)):

    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Create new user
    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )

    # Add user to database
    db.add(new_user)

    # Save changes
    db.commit()

    # Get generated user ID
    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "user_id": new_user.id
    }

@app.post("/login", response_model=LoginResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user.email).first()
    

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(user.password, existing_user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    access_token = create_access_token(existing_user.id)
    return {
        "message": "Login successful",
        "access_token": access_token
        }


@app.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user


@app.post("/assessments", status_code=201)
def create_assessment(
    data: MaternalAssessmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # Run risk prediction
    patient_data = data.model_dump()

    risk_prediction, risk_prob = predict_risk(patient_data)

    # Run nutrient prediction
    nutrient_prediction, nutrient_prob = predict_nutrients(patient_data)

    # Get food recommendations
    food_data = recommend_food(nutrient_prediction)

    # Save assessment data
    new_assessment = MaternalAssessment(
    user_id=current_user.id,

    age=data.age,
    systolicBP=data.systolicBP,
    diastolicBP=data.diastolicBP,
    BS=data.BS,
    bodyTemp=data.bodyTemp,
    heartRate=data.heartRate,

    bmi=data.bmi,
    hb=data.hb,
    dietScore=data.dietScore,
    protein_g=data.protein_g,
    calcium_mg=data.calcium_mg,
    iron_mg=data.iron_mg,

    risk_class=int(risk_prediction),
    high_risk_probability=float(risk_prob),

    deficiency_type=food_data["deficiency"],
    nutrient_confidence=float(nutrient_prob),

    recommended_foods=food_data["foods"]
)
    db.add(new_assessment)
    db.commit()
    db.refresh(new_assessment)

    return {
        "message": "Assessment completed successfully",
        "assessment_id": new_assessment.id,
        "user_id": current_user.id,

        "risk": {
            "class": int(risk_prediction),
            "high_risk_probability": round(float(risk_prob), 3)
        },

        "nutrition": {
            "deficiency_type": food_data["deficiency"],
            "confidence": round(float(nutrient_prob), 3),
            "recommended_foods": food_data["foods"]
        }
    }

@app.get("/assessments", response_model=list[MaternalAssessmentResponse])
def get_assessments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    assessments = db.query(MaternalAssessment).filter(
        MaternalAssessment.user_id == current_user.id
    ).all()

    return assessments

@app.get(
    "/assessments/{assessment_id}",
    response_model=MaternalAssessmentResponse
)
def get_assessment(
    assessment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    assessment = db.query(MaternalAssessment).filter(
        MaternalAssessment.id == assessment_id,
        MaternalAssessment.user_id == current_user.id
    ).first()

    if not assessment:
        raise HTTPException(
            status_code=404,
            detail="Assessment not found"
        )

    return assessment

@app.put(
    "/assessments/{assessment_id}",
    response_model=MaternalAssessmentResponse
)
def update_assessment(
    assessment_id: int,
    data: MaternalAssessmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    assessment = db.query(MaternalAssessment).filter(
        MaternalAssessment.id == assessment_id,
        MaternalAssessment.user_id == current_user.id
    ).first()

    if not assessment:
        raise HTTPException(
            status_code=404,
            detail="Assessment not found"
        )

    patient_data = data.model_dump()

    risk_prediction, risk_prob = predict_risk(patient_data)
    nutrient_prediction, nutrient_prob = predict_nutrients(patient_data)
    food_data = recommend_food(nutrient_prediction)

    assessment.age = data.age
    assessment.systolicBP = data.systolicBP
    assessment.diastolicBP = data.diastolicBP
    assessment.BS = data.BS
    assessment.bodyTemp = data.bodyTemp
    assessment.heartRate = data.heartRate

    assessment.bmi = data.bmi
    assessment.hb = data.hb
    assessment.dietScore = data.dietScore
    assessment.protein_g = data.protein_g
    assessment.calcium_mg = data.calcium_mg
    assessment.iron_mg = data.iron_mg

    assessment.risk_class = int(risk_prediction)
    assessment.high_risk_probability = float(risk_prob)

    assessment.deficiency_type = food_data["deficiency"]
    assessment.nutrient_confidence = float(nutrient_prob)
    assessment.recommended_foods = food_data["foods"]
    db.commit()
    db.refresh(assessment)

    return assessment


@app.delete("/assessments/{assessment_id}")
def delete_assessment(
    assessment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    assessment = db.query(MaternalAssessment).filter(
        MaternalAssessment.id == assessment_id,
        MaternalAssessment.user_id == current_user.id
    ).first()

    if not assessment:
        raise HTTPException(
            status_code=404,
            detail="Assessment not found"
        )

    db.delete(assessment)
    db.commit()

    return {
        "message": "Assessment deleted successfully"
    }
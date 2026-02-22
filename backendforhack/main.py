from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import MaternalData
from model_loader import predict_risk, predict_nutrients
from recomendation import recommend_food

# ================================
# Initialize FastAPI App
# ================================

app = FastAPI(title="Maternal Health AI Backend")

# Enable CORS (so frontend can connect later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================================
# Health Check Route
# ================================

@app.get("/")
def home():
    return {"message": "Maternal Health Backend Running 🚀"}

# ================================
# Prediction Route
# ================================

@app.post("/predict")
async def predict(data: MaternalData):

    patient_dict = data.dict()

    # ---------------- Risk Prediction ----------------
    risk_prediction, risk_prob = predict_risk(patient_dict)

    # ---------------- Nutrient Prediction ----------------
    nutrient_prediction, nutrient_prob = predict_nutrients(patient_dict)
    food_data = recommend_food(nutrient_prediction)

    return {
        "patient_id": data.patient_id,
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
import joblib
import numpy as np
import os

# ================================
# Load Models
# ================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

risk_model = joblib.load(os.path.join(MODEL_DIR, "risk_model.pkl"))
nutrient_model = joblib.load(os.path.join(MODEL_DIR, "nutrient_model.pkl"))
label_encoder = joblib.load(os.path.join(MODEL_DIR, "label_encoder.pkl"))


# ================================
# Risk Prediction
# ================================

def predict_risk(data: dict):

    risk_features = np.array([[
        data["age"],
        data["systolicBP"],
        data["diastolicBP"],
        data["BS"],
        data["bodyTemp"],
        data["heartRate"]
    ]])

    prediction = risk_model.predict(risk_features)[0]
    probs = risk_model.predict_proba(risk_features)[0]

    # Get probability of HIGH RISK
    classes = list(label_encoder.classes_)
    high_index = classes.index("high risk")

    high_prob = float(probs[high_index])

    return prediction, high_prob


# ================================
# Nutrient Prediction
# ================================

def predict_nutrients(data: dict):

    nutrient_features = np.array([[
        data["age"],
        data["bmi"],
        data["hb"],
        data["dietScore"],
        data["protein_g"],
        data["calcium_mg"],
        data["iron_mg"]
    ]])

    prediction = nutrient_model.predict(nutrient_features)[0]
    probs = nutrient_model.predict_proba(nutrient_features)[0]

    probability = float(probs.max())

    return prediction, probability
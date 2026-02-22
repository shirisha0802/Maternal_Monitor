import os
import joblib
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load models
risk_model = joblib.load(os.path.join(BASE_DIR, "models", "risk_model.pkl"))
nutrient_model = joblib.load(os.path.join(BASE_DIR, "models", "nutrient_model.pkl"))
label_encoder = joblib.load(os.path.join(BASE_DIR, "models", "label_encoder.pkl"))

# ---- Sample for maternal risk ----
risk_sample = np.array([[25, 130, 80, 15.0, 98.0, 86]])
risk_pred = risk_model.predict(risk_sample)
risk_probs = risk_model.predict_proba(risk_sample)

risk_label = label_encoder.inverse_transform(risk_pred)[0]
risk_score = float(risk_probs[0].max())

print("Maternal Risk Level:", risk_label)
print("Risk Confidence:", round(risk_score, 3))

# ---- Sample for nutrient deficiency ----
nutrient_sample = np.array([[25, 22.5, 10.5, 4, 40, 500, 8]])
nutrient_pred = nutrient_model.predict(nutrient_sample)
nutrient_probs = nutrient_model.predict_proba(nutrient_sample)

print("Deficiency Type:", nutrient_pred[0])
print("Deficiency Probability:", round(float(nutrient_probs[0].max()), 3))
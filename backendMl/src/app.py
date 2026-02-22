from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import joblib
import pandas as pd
import os

# ================================
# Path Setup
# ================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "models")

risk_model = joblib.load(os.path.join(MODEL_DIR, "risk_model.pkl"))
nutrient_model = joblib.load(os.path.join(MODEL_DIR, "nutrient_model.pkl"))
label_encoder = joblib.load(os.path.join(MODEL_DIR, "label_encoder.pkl"))

# ================================
# FastAPI Init
# ================================

app = FastAPI(title="Maternal Health AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================================
# Input Schema
# ================================

class HealthInput(BaseModel):
    age: int
    systolicBP: float
    diastolicBP: float
    BS: float
    bodyTemp: float
    heartRate: float
    bmi: float
    hb: float
    dietScore: int
    protein_g: float
    calcium_mg: float
    iron_mg: float


# ================================
# Frontend UI
# ================================

@app.get("/", response_class=HTMLResponse)
def home():
    return """
    <html>
    <head>
        <title>Maternal Health AI</title>
        <style>
            body { font-family: Arial; background:#f2f6fc; text-align:center; padding:40px; }
            .card { background:white; padding:20px; width:500px; margin:auto; border-radius:10px;
                    box-shadow:0 5px 15px rgba(0,0,0,0.1); }
            input { width:90%; padding:8px; margin:5px; border-radius:5px; border:1px solid #ccc; }
            button { padding:10px; background:#0077ff; color:white; border:none; border-radius:5px; cursor:pointer; }
            button:hover { background:#005fcc; }
            .result { margin-top:20px; text-align:left; font-weight:bold; }

            .bar-container {
                width:100%;
                background:#ddd;
                border-radius:10px;
                height:20px;
                margin-top:10px;
            }

            .bar {
                height:20px;
                width:0%;
                border-radius:10px;
                transition:width 0.6s ease-in-out;
            }

            .chart {
                margin-top:20px;
                text-align:left;
            }

            .chart-bar {
                height:18px;
                background:#3498db;
                margin:5px 0;
                border-radius:5px;
                transition:width 0.6s ease-in-out;
            }
        </style>
    </head>
    <body>
        <h2>Maternal Health Prediction</h2>
        <div class="card">

            <input id="age" placeholder="Age">
            <input id="systolicBP" placeholder="Systolic BP">
            <input id="diastolicBP" placeholder="Diastolic BP">
            <input id="BS" placeholder="Blood Sugar (mmol/L)">
            <input id="bodyTemp" placeholder="Body Temp (°F)">
            <input id="heartRate" placeholder="Heart Rate">

            <input id="bmi" placeholder="BMI">
            <input id="hb" placeholder="Hemoglobin">
            <input id="dietScore" placeholder="Diet Score">
            <input id="protein_g" placeholder="Protein (g)">
            <input id="calcium_mg" placeholder="Calcium (mg)">
            <input id="iron_mg" placeholder="Iron (mg)">

            <button onclick="predict()">Predict</button>

            <div class="result" id="result"></div>

            <div class="bar-container">
                <div id="riskBar" class="bar"></div>
            </div>

            <div class="chart">
                <div>Low Risk</div>
                <div id="lowBar" class="chart-bar"></div>

                <div>Mid Risk</div>
                <div id="midBar" class="chart-bar" style="background:#f39c12;"></div>

                <div>High Risk</div>
                <div id="highBar" class="chart-bar" style="background:#e74c3c;"></div>
            </div>

        </div>

        <script>
        async function predict() {

            const response = await fetch('/predict', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    age: parseInt(age.value),
                    systolicBP: parseFloat(systolicBP.value),
                    diastolicBP: parseFloat(diastolicBP.value),
                    BS: parseFloat(BS.value),
                    bodyTemp: parseFloat(bodyTemp.value),
                    heartRate: parseFloat(heartRate.value),
                    bmi: parseFloat(bmi.value),
                    hb: parseFloat(hb.value),
                    dietScore: parseInt(dietScore.value),
                    protein_g: parseFloat(protein_g.value),
                    calcium_mg: parseFloat(calcium_mg.value),
                    iron_mg: parseFloat(iron_mg.value)
                })
            });

            const data = await response.json();

            const highPercent = data.high_prob * 100;
            const lowPercent = data.low_prob * 100;
            const midPercent = data.mid_prob * 100;

            let color = "green";
            if (highPercent > 60) color = "red";
            else if (highPercent > 30) color = "orange";

            document.getElementById("riskBar").style.width = highPercent + "%";
            document.getElementById("riskBar").style.backgroundColor = color;

            document.getElementById("lowBar").style.width = lowPercent + "%";
            document.getElementById("midBar").style.width = midPercent + "%";
            document.getElementById("highBar").style.width = highPercent + "%";

            result.innerHTML = `
                <p><b>Maternal Risk Category:</b> ${data.maternal_risk}</p>
                <p><b>High-Risk Probability:</b> ${highPercent.toFixed(1)}%</p>
                <p><b>Deficiency Type:</b> ${data.deficiency_type}</p>
                <p><b>Recommendation:</b> ${data.food_recommendation}</p>
            `;
        }
        </script>
    </body>
    </html>
    """


# ================================
# Prediction Endpoint
# ================================

food_map = {
    0: "Balanced diet maintained.",
    1: "Increase iron-rich foods.",
    2: "Increase protein intake.",
    3: "Increase calcium intake.",
    4: "Comprehensive nutrient-rich diet required."
}

deficiency_labels = {
    0: "No Deficiency",
    1: "Iron Deficiency",
    2: "Protein Deficiency",
    3: "Calcium Deficiency",
    4: "Multi Nutrient Deficiency"
}

@app.post("/predict")
def predict(data: HealthInput):

    risk_input = pd.DataFrame([{
        "Age": data.age,
        "SystolicBP": data.systolicBP,
        "DiastolicBP": data.diastolicBP,
        "BS": data.BS,
        "BodyTemp": data.bodyTemp,
        "HeartRate": data.heartRate
    }])

    risk_probs = risk_model.predict_proba(risk_input)
    risk_pred = risk_model.predict(risk_input)

    risk_label = label_encoder.inverse_transform(risk_pred)[0]

    classes = list(label_encoder.classes_)
    low_index = classes.index("low risk")
    mid_index = classes.index("mid risk")
    high_index = classes.index("high risk")

    nutrient_input = pd.DataFrame([{
        "age": data.age,
        "bmi": data.bmi,
        "hb": data.hb,
        "dietScore": data.dietScore,
        "protein_g": data.protein_g,
        "calcium_mg": data.calcium_mg,
        "iron_mg": data.iron_mg
    }])

    nutrient_pred = nutrient_model.predict(nutrient_input)[0]

    return {
        "maternal_risk": risk_label,
        "low_prob": round(float(risk_probs[0][low_index]), 3),
        "mid_prob": round(float(risk_probs[0][mid_index]), 3),
        "high_prob": round(float(risk_probs[0][high_index]), 3),
        "deficiency_type": deficiency_labels[int(nutrient_pred)],
        "food_recommendation": food_map[int(nutrient_pred)]
    }
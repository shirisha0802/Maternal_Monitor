import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const MaternalDashboard = () => {
  const location = useLocation();

  const isFromMCQ = location.state?.dietScore !== undefined;

  const [formData, setFormData] = useState({
    patient_id: "",
    age: "",
    systolicBP: "",
    diastolicBP: "",
    BS: "",
    bodyTemp: "",
    heartRate: "",
    bmi: "",
    hb: "",
    dietScore: location.state?.dietScore || "",
    protein_g: "",
    calcium_mg: "",
    iron_mg: "",
  });

  const [result, setResult] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 Appointment Logic
  const calculateAppointment = (probability) => {
    const today = new Date();
    let days = 28;
    let message = "Routine Follow-up (Low Risk)";
    let color = "text-green-600";
    let bg = "bg-green-100";

    if (probability >= 0.75) {
      days = 7;
      message = "⚠ High Risk – Follow-up in 1 Week";
      color = "text-red-600";
      bg = "bg-red-100";
    } else if (probability >= 0.5) {
      days = 14;
      message = "📅 Moderate Risk – Follow-up in 2 Weeks";
      color = "text-yellow-600";
      bg = "bg-yellow-100";
    }

    today.setDate(today.getDate() + days);

    return {
      date: today.toDateString(),
      message,
      color,
      bg,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        patient_id: Number(formData.patient_id),
        age: Number(formData.age),
        systolicBP: Number(formData.systolicBP),
        diastolicBP: Number(formData.diastolicBP),
        BS: Number(formData.BS),
        bodyTemp: Number(formData.bodyTemp),
        heartRate: Number(formData.heartRate),
        bmi: Number(formData.bmi),
        hb: Number(formData.hb),
        dietScore: Number(formData.dietScore),
        protein_g: Number(formData.protein_g),
        calcium_mg: Number(formData.calcium_mg),
        iron_mg: Number(formData.iron_mg),
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        payload
      );

      setResult(response.data);

      const appointmentData = calculateAppointment(
        response.data.risk.high_risk_probability
      );

      setAppointment(appointmentData);

    } catch (error) {
      console.error(error.response?.data);
      alert("Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8">

        <h1 className="text-3xl font-bold text-center text-purple-700 mb-8">
          Predict AI – Maternal Risk & Nutrition
        </h1>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">

          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="text-sm text-gray-600 capitalize">
                {key.replace("_", " ")}
              </label>
              <input
                type="number"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                readOnly={key === "dietScore" && isFromMCQ}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                  key === "dietScore" && isFromMCQ
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="md:col-span-2 bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            {loading ? "Processing..." : "Predict Risk & Nutrition"}
          </button>
        </form>

        {/* 🔥 RESULTS */}
        {result && (
          <div className="mt-10 p-6 bg-gray-50 rounded-xl border">

            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              Prediction Result
            </h2>

            <p className="text-lg font-semibold">
              Risk Probability:{" "}
              {(result.risk.high_risk_probability * 100).toFixed(1)}%
            </p>

            {appointment && (
              <div className={`mt-6 p-4 rounded-lg ${appointment.bg}`}>
                <p className={`font-semibold ${appointment.color}`}>
                  {appointment.message}
                </p>
                <p className="mt-2">
                  Next Appointment Date:{" "}
                  <strong>{appointment.date}</strong>
                </p>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-xl font-semibold text-teal-600 mb-2">
                Nutrition Assessment
              </h3>

              <p>
                Deficiency Type:{" "}
                <strong>{result.nutrition.deficiency_type}</strong>
              </p>

              <p>
                Confidence:{" "}
                {(result.nutrition.confidence * 100).toFixed(1)}%
              </p>

              <ul className="list-disc list-inside mt-3">
                {result.nutrition.recommended_foods.map((food, index) => (
                  <li key={index}>{food}</li>
                ))}
              </ul>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default MaternalDashboard;
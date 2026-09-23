import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const MaternalDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get assessment ID when Edit is clicked
  const queryParams = new URLSearchParams(location.search);
  const editId = queryParams.get("edit");

  const isEditMode = Boolean(editId);

  const isFromMCQ = location.state?.dietScore !== undefined;

  const [formData, setFormData] = useState({
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
  const [loading, setLoading] = useState(false);
  const [loadingAssessment, setLoadingAssessment] = useState(false);

  // Load existing assessment when Edit is selected
  useEffect(() => {
    if (!editId) return;

    const fetchAssessment = async () => {
      try {
        setLoadingAssessment(true);

        const token = localStorage.getItem("access_token");

        const response = await axios.get(
          `${process.env.ASSESSMENT_API_URL}/${editId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const assessment = response.data;

        setFormData({
          age: assessment.age,
          systolicBP: assessment.systolicBP,
          diastolicBP: assessment.diastolicBP,
          BS: assessment.BS,
          bodyTemp: assessment.bodyTemp,
          heartRate: assessment.heartRate,
          bmi: assessment.bmi,
          hb: assessment.hb,
          dietScore: assessment.dietScore,
          protein_g: assessment.protein_g,
          calcium_mg: assessment.calcium_mg,
          iron_mg: assessment.iron_mg,
        });

        setResult({
          risk: {
            high_risk_probability:
              assessment.high_risk_probability,
          },
          nutrition: {
            deficiency_type:
              assessment.deficiency_type,
            confidence:
              assessment.nutrient_confidence,
            recommended_foods:
              assessment.recommended_foods,
          },
        });

      } catch (error) {
        console.error(error.response?.data);

        alert(
          error.response?.data?.detail ||
          "Failed to load assessment."
        );

        navigate("/patients/history");
      } finally {
        setLoadingAssessment(false);
      }
    };

    fetchAssessment();
  }, [editId, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("access_token");

      const payload = {
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

      let response;

      // Edit existing assessment
      if (isEditMode) {
        response = await axios.put(
          `${process.env.ASSESSMENT_API_URL}/${editId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Assessment updated successfully.");

      } else {
        // Create new assessment
        response = await axios.post(
          `${process.env.ASSESSMENT_API_URL}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Assessment created successfully.");
      }

      const assessment = response.data;

      // Handle POST response structure
      if (assessment.risk && assessment.nutrition) {
        setResult(assessment);
      } else {
        // Handle PUT response structure
        setResult({
          risk: {
            high_risk_probability:
              assessment.high_risk_probability,
          },
          nutrition: {
            deficiency_type:
              assessment.deficiency_type,
            confidence:
              assessment.nutrient_confidence,
            recommended_foods:
              assessment.recommended_foods,
          },
        });
      }

      // Remove edit mode after update
      if (isEditMode) {
        navigate("/dashboard", { replace: true });
      }

    } catch (error) {
      console.error(error.response?.data);

      alert(
        error.response?.data?.detail ||
        "Assessment failed."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingAssessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-purple-600 font-semibold">
          Loading assessment...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-100 py-10 px-4">

      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8">

        <h1 className="text-3xl font-bold text-center text-purple-700 mb-2">
          {isEditMode
            ? "Edit Maternal Assessment"
            : "Predict AI – Maternal Risk & Nutrition"}
        </h1>

        {isEditMode && (
          <p className="text-center text-gray-500 mb-8">
            Update the assessment details and submit again.
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-4"
        >

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
                readOnly={
                  key === "dietScore" &&
                  isFromMCQ &&
                  !isEditMode
                }
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                  key === "dietScore" &&
                  isFromMCQ &&
                  !isEditMode
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
            {loading
              ? "Processing..."
              : isEditMode
              ? "Update Assessment"
              : "Predict Risk & Nutrition"}
          </button>

        </form>

        {result && (
          <div className="mt-10 p-6 bg-gray-50 rounded-xl border">

            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              Prediction Result
            </h2>

            <p className="text-lg font-semibold">
              Risk Probability:{" "}
              {(result.risk.high_risk_probability * 100).toFixed(1)}%
            </p>

            <div className="mt-6">

              <h3 className="text-xl font-semibold text-teal-600 mb-2">
                Nutrition Assessment
              </h3>

              <p>
                Deficiency Type:{" "}
                <strong>
                  {result.nutrition.deficiency_type}
                </strong>
              </p>

              <p>
                Confidence:{" "}
                {(result.nutrition.confidence * 100).toFixed(1)}%
              </p>

              <ul className="list-disc list-inside mt-3">
                {result.nutrition.recommended_foods.map(
                  (food, index) => (
                    <li key={index}>{food}</li>
                  )
                )}
              </ul>

            </div>

          </div>
        )}

        <div className="mt-8 text-center">

          <button
            type="button"
            onClick={() => navigate("/patients/history")}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            View Assessment History
          </button>

        </div>

      </div>

    </div>
  );
};

export default MaternalDashboard;
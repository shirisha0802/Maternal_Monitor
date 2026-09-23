import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PatientDetails() {
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get all assessments
  const fetchAssessments = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(
        "http://127.0.0.1:8000/assessments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAssessments(response.data);
    } catch (error) {
      console.error(error.response?.data);

      setError(
        error.response?.data?.detail ||
        "Failed to load assessments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  // Delete assessment
  const handleDelete = async (assessmentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this assessment?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("access_token");

      await axios.delete(
        `http://127.0.0.1:8000/assessments/${assessmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove deleted assessment from the page
      setAssessments(
        assessments.filter(
          (assessment) => assessment.id !== assessmentId
        )
      );

      alert("Assessment deleted successfully.");
    } catch (error) {
      console.error(error.response?.data);

      alert(
        error.response?.data?.detail ||
        "Failed to delete assessment."
      );
    }
  };

  // Edit assessment
  const handleEdit = (assessmentId) => {
    navigate(`/dashboard?edit=${assessmentId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-purple-600 font-semibold">
          Loading assessments...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">{error}</p>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2 bg-purple-600 text-white rounded-md"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-100 py-12 px-6">

      <div className="max-w-6xl mx-auto">

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-purple-700">
            Assessment History
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Previous maternal health assessments
          </p>
        </div>

        {assessments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center">

            <p className="text-gray-500">
              No assessments found.
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="mt-5 px-6 py-2 bg-purple-600 text-white rounded-md"
            >
              Create Assessment
            </button>

          </div>
        ) : (
          <div className="space-y-6">

            {assessments.map((assessment) => (
              <div
                key={assessment.id}
                className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8"
              >

                {/* Assessment Header */}

                <div className="flex justify-between items-center mb-6">

                  <div>
                    <h2 className="text-xl font-semibold text-purple-700">
                      Assessment #{assessment.id}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {new Date(
                        assessment.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-3">

                    <button
                      onClick={() =>
                        handleEdit(assessment.id)
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(assessment.id)
                      }
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>

                  </div>

                </div>

                {/* Health Information */}

                <h3 className="text-lg font-semibold text-teal-700 mb-4">
                  Health Information
                </h3>

                <div className="grid md:grid-cols-3 gap-5">

                  <Detail label="Age" value={assessment.age} />
                  <Detail label="Systolic BP" value={assessment.systolicBP} />
                  <Detail label="Diastolic BP" value={assessment.diastolicBP} />
                  <Detail label="Blood Sugar" value={assessment.BS} />
                  <Detail label="Body Temperature" value={assessment.bodyTemp} />
                  <Detail label="Heart Rate" value={assessment.heartRate} />
                  <Detail label="BMI" value={assessment.bmi} />
                  <Detail label="Hemoglobin" value={assessment.hb} />
                  <Detail label="Diet Score" value={assessment.dietScore} />
                  <Detail label="Protein" value={assessment.protein_g} />
                  <Detail label="Calcium" value={assessment.calcium_mg} />
                  <Detail label="Iron" value={assessment.iron_mg} />

                </div>

                {/* Risk Assessment */}

                <div className="mt-8 bg-purple-50 border border-purple-200 rounded-xl p-6">

                  <h3 className="text-lg font-semibold text-purple-700 mb-3">
                    Risk Assessment
                  </h3>

                  <p>
                    Risk Class:{" "}
                    <strong>
                      {assessment.risk_class}
                    </strong>
                  </p>

                  <p>
                    High Risk Probability:{" "}
                    <strong>
                      {(assessment.high_risk_probability * 100).toFixed(1)}%
                    </strong>
                  </p>

                </div>

                {/* Nutrition Assessment */}

                <div className="mt-6 bg-teal-50 border border-teal-200 rounded-xl p-6">

                  <h3 className="text-lg font-semibold text-teal-700 mb-3">
                    Nutrition Assessment
                  </h3>

                  <p>
                    Deficiency:{" "}
                    <strong>
                      {assessment.deficiency_type}
                    </strong>
                  </p>

                  <p>
                    Confidence:{" "}
                    <strong>
                      {(assessment.nutrient_confidence * 100).toFixed(1)}%
                    </strong>
                  </p>

                  <p className="mt-4 font-medium">
                    Recommended Foods:
                  </p>

                  <ul className="list-disc list-inside mt-2">
                    {assessment.recommended_foods.map(
                      (food, index) => (
                        <li key={index}>{food}</li>
                      )
                    )}
                  </ul>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-gray-400">
      {label}
    </p>

    <p className="mt-1 text-base font-medium text-gray-800">
      {value}
    </p>
  </div>
);
import React, { useState } from "react";

const symptomsData = {
  IMMEDIATE: [
    "HEAVY_VAGINAL_BLEEDING",
    "SEVERE_ABDOMINAL_PAIN",
    "SEIZURES",
    "DIFFICULTY_BREATHING",
    "SEVERE_HEADACHE_VISION",
    "SUDDEN_SWELLING_FACE_HANDS",
    "HIGH_FEVER",
    "NO_BABY_MOVEMENT",
    "WATER_LEAKING",
    "FAINTING",
    "SEVERE_TRAUMA"
  ],
  URGENT: [
    "PERSISTENT_CRAMPS",
    "PRETERM_CONTRACTIONS",
    "BURNING_URINATION",
    "UNUSUAL_DISCHARGE",
    "SUDDEN_DIZZINESS",
    "CONTINUOUS_VOMITING",
    "SEVERE_ITCHING",
    "REDUCED_BABY_MOVEMENT"
  ],
  SOON: [
    "MILD_SWELLING_FEET",
    "MILD_CRAMPS",
    "MILD_NAUSEA",
    "MINOR_SPOTTING",
    "MILD_HEADACHE"
  ]
};

const EmergencySymptoms = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);

  const handleCheckboxChange = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const today = new Date();
    let daysToAdd = 28;
    let riskWeight = 0.1;
    let status = "Routine Monitoring";
    let color = "green";

    const hasImmediate = selectedSymptoms.some((s) =>
      symptomsData.IMMEDIATE.includes(s)
    );
    const hasUrgent = selectedSymptoms.some((s) =>
      symptomsData.URGENT.includes(s)
    );
    const hasSoon = selectedSymptoms.some((s) =>
      symptomsData.SOON.includes(s)
    );

    if (hasImmediate) {
      daysToAdd = 0;
      riskWeight = 0.95;
      status = "EMERGENCY – Immediate Medical Attention Required";
      color = "red";
    } else if (hasUrgent) {
      daysToAdd = 2;
      riskWeight = 0.75;
      status = "Urgent – Visit within 48 Hours";
      color = "orange";
    } else if (hasSoon) {
      daysToAdd = 7;
      riskWeight = 0.4;
      status = "Moderate Concern – Visit within 1 Week";
      color = "yellow";
    }

    today.setDate(today.getDate() + daysToAdd);

    setResult({
      appointmentDate: today.toDateString(),
      riskWeight,
      status,
      color,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-pink-200 flex items-center justify-center px-4 py-10">
      <div className="max-w-4xl w-full bg-white/90 shadow-2xl rounded-3xl p-8 border border-pink-200">

        <h1 className="text-3xl font-bold text-center text-purple-600 mb-10">
          Maternal Emergency Symptoms
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">

          {Object.entries(symptomsData).map(([severity, symptoms]) => (
            <div key={severity}>
              <h2 className={`text-xl font-semibold mb-4 ${
                severity === "IMMEDIATE"
                  ? "text-red-600"
                  : severity === "URGENT"
                  ? "text-orange-500"
                  : "text-yellow-500"
              }`}>
                {severity} Level
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {symptoms.map((symptom) => (
                  <label
                    key={symptom}
                    className="flex items-center gap-3 bg-pink-50 p-3 rounded-xl shadow-sm hover:shadow-md transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(symptom)}
                      onChange={() => handleCheckboxChange(symptom)}
                      className="w-5 h-5 accent-purple-500"
                    />
                    <span className="text-gray-700">
                      {symptom.replaceAll("_", " ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition duration-300 shadow-lg"
          >
            Evaluate Symptoms
          </button>

        </form>

        {/* 🔥 RESULT CARD */}
        {result && (
          <div className={`mt-10 p-6 rounded-2xl shadow-lg border-l-8 ${
            result.color === "red"
              ? "bg-red-50 border-red-500"
              : result.color === "orange"
              ? "bg-orange-50 border-orange-500"
              : result.color === "yellow"
              ? "bg-yellow-50 border-yellow-500"
              : "bg-green-50 border-green-500"
          }`}>

            <h2 className="text-2xl font-bold mb-3">
              Clinical Recommendation
            </h2>

            <p className="text-lg font-semibold">
              {result.status}
            </p>

            <p className="mt-2">
              <strong>Emergency Risk Weight:</strong>{" "}
              {(result.riskWeight * 100).toFixed(0)}%
            </p>

            <p className="mt-2">
              <strong>Next Appointment Date:</strong>{" "}
              {result.appointmentDate}
            </p>

          </div>
        )}

      </div>
    </div>
  );
};

export default EmergencySymptoms;
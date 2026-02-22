import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PatientDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state;

  if (!patient) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-lg font-medium text-gray-600 mb-4">
          Patient data not found.
        </h2>
        <button
          onClick={() => navigate("/register")}
          className="px-6 py-2 bg-purple-600 text-white rounded-md shadow hover:bg-purple-700 transition"
        >
          Register Patient
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-purple-700">
            Patient Profile
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Maternal Health Monitoring Overview
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-10">

          {/* Patient Overview */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xl font-bold">
              {patient.firstName.charAt(0)}
              {patient.lastName.charAt(0)}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {patient.firstName} {patient.lastName}
              </h2>
              <p className="text-sm text-gray-500">
                Username: {patient.username}
              </p>
              <p className="text-sm text-gray-500">
                Phone: {patient.phone}
              </p>
            </div>
          </div>

          {/* Appointment Card */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
            <p className="text-sm text-purple-600 font-medium">
              Next Scheduled Appointment
            </p>
            <p className="text-lg font-semibold text-purple-800">
              {patient.nextAppointment}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Trimester 1 – Routine Follow-up
            </p>
          </div>

          {/* Medical Record Section */}
          <div>
            <h3 className="text-lg font-semibold text-teal-700 mb-6">
              Medical Record (Initial Status)
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                "Age",
                "Systolic BP",
                "Diastolic BP",
                "Blood Sugar",
                "Heart Rate",
                "Body Temperature",
                "BMI",
                "Hemoglobin",
                "Diet Score",
                "Protein",
                "Calcium",
                "Iron",
              ].map((field) => (
                <Detail key={field} label={field} value="Not Recorded" />
              ))}
            </div>
          </div>

          <div className="mt-10 text-right">
            <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-md">
              ✔ Registration Successful
            </span>
          </div>

        </div>
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
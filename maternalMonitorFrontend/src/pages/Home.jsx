import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200">

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-28 flex flex-col items-center text-center">

        <h1 className="text-5xl md:text-6xl font-bold text-purple-900 leading-tight max-w-4xl">
          Intelligent Maternal Health Monitoring Platform
        </h1>

        <p className="mt-8 text-lg md:text-xl text-gray-700 max-w-3xl leading-relaxed">
          Leveraging artificial intelligence to transform routine clinical
          indicators into predictive risk insights, structured nutrition
          guidance, and optimized follow-up planning for safer pregnancies.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <button
            onClick={() => navigate("/login")}
            className="px-10 py-4 bg-purple-700 text-white rounded-xl shadow-lg hover:bg-purple-800 transition duration-300 text-lg font-semibold"
          >
            Access System
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-10 py-4 bg-white text-purple-700 border border-purple-300 rounded-xl shadow hover:bg-purple-50 transition duration-300 text-lg font-semibold"
          >
            Register New Patient
          </button>
        </div>

      </section>

      {/* SYSTEM OVERVIEW SECTION */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-4xl font-bold text-purple-800 mb-16">
            Clinical Intelligence Designed for Maternal Care
          </h2>

          <div className="grid md:grid-cols-3 gap-12">

            <div className="p-8 rounded-2xl shadow-md border border-purple-100 hover:shadow-xl transition">
              <div className="text-purple-600 text-4xl mb-4">01</div>
              <h3 className="text-xl font-semibold text-purple-800 mb-4">
                Predictive Risk Stratification
              </h3>
              <p className="text-gray-600 leading-relaxed">
                AI models analyze maternal indicators including blood pressure,
                glucose levels, temperature, and heart rate to identify early
                high-risk patterns before complications escalate.
              </p>
            </div>

            <div className="p-8 rounded-2xl shadow-md border border-purple-100 hover:shadow-xl transition">
              <div className="text-purple-600 text-4xl mb-4">02</div>
              <h3 className="text-xl font-semibold text-purple-800 mb-4">
                Personalized Nutritional Assessment
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Structured nutrition scoring detects potential deficiencies and
                generates practical dietary recommendations to support healthy
                maternal and fetal development.
              </p>
            </div>

            <div className="p-8 rounded-2xl shadow-md border border-purple-100 hover:shadow-xl transition">
              <div className="text-purple-600 text-4xl mb-4">03</div>
              <h3 className="text-xl font-semibold text-purple-800 mb-4">
                Dynamic Follow-Up Scheduling
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Follow-up appointments are automatically adjusted based on risk
                probability thresholds, ensuring timely medical supervision for
                high-risk cases.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CLINICAL IMPACT SECTION */}
      <section className="py-24 px-6 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-4xl font-bold text-purple-900 mb-8">
            Supporting Frontline Healthcare Providers
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
            In rural and high-load clinical environments, healthcare workers
            often operate under significant time and resource constraints.
            This platform standardizes maternal risk evaluation, minimizes
            oversight, and enhances decision-making through structured,
            data-driven intelligence.
          </p>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="bg-purple-800 py-20 text-center text-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">
            Elevating Maternal Care Through Intelligent Monitoring
          </h2>

          <p className="text-lg opacity-90 mb-10">
            Transforming routine antenatal data into preventive healthcare
            interventions — enabling safer pregnancies and improved outcomes.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-10 py-4 bg-white text-purple-800 rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition"
          >
            Launch Predict AI
          </button>
        </div>
      </section>

    </div>
  );
}
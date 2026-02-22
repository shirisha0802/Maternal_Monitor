import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    id: "mealFrequency",
    question: "In a normal day, how many times do you eat?",
    options: [
      { text: "3 meals and snacks", score: 10 },
      { text: "3 meals", score: 7 },
      { text: "2 meals", score: 3 },
      { text: "Skip meals", score: 0 }
    ]
  },
  {
    id: "appetiteLoss",
    question: "Do you stay hungry because you don’t feel like eating?",
    options: [
      { text: "Never", score: 10 },
      { text: "Sometimes", score: 7 },
      { text: "Often", score: 3 },
      { text: "Almost daily", score: 0 }
    ]
  },
  {
    id: "proteinIntake",
    question: "How often do you eat egg, dal, milk, paneer or chicken?",
    options: [
      { text: "2–3 times daily", score: 10 },
      { text: "Once daily", score: 7 },
      { text: "Few times a week", score: 3 },
      { text: "Rarely", score: 0 }
    ]
  },
  {
    id: "milkIntake",
    question: "Do you drink milk?",
    options: [
      { text: "Twice daily", score: 10 },
      { text: "Once daily", score: 7 },
      { text: "Few days/week", score: 3 },
      { text: "Never", score: 0 }
    ]
  },
  {
    id: "leafyVegetables",
    question: "How often do you eat green leafy vegetables?",
    options: [
      { text: "Daily", score: 10 },
      { text: "Alternate days", score: 7 },
      { text: "Weekly", score: 3 },
      { text: "Rarely", score: 0 }
    ]
  },
  {
    id: "ironFoods",
    question: "Do you eat jaggery, dates, or groundnuts?",
    options: [
      { text: "Daily", score: 10 },
      { text: "Few times/week", score: 7 },
      { text: "Sometimes", score: 3 },
      { text: "Never", score: 0 }
    ]
  },
  {
    id: "teaAfterMeal",
    question: "Do you drink tea or coffee immediately after meals?",
    options: [
      { text: "Never", score: 10 },
      { text: "Sometimes", score: 7 },
      { text: "Often", score: 3 },
      { text: "Always", score: 0 }
    ]
  },
  {
    id: "fruitIntake",
    question: "How often do you eat fruits?",
    options: [
      { text: "Daily", score: 10 },
      { text: "3–4 times/week", score: 7 },
      { text: "Weekly", score: 3 },
      { text: "Rarely", score: 0 }
    ]
  },
  {
    id: "vitaminCWithMeals",
    question: "Do you take lemon or citrus fruits with meals?",
    options: [
      { text: "Daily", score: 10 },
      { text: "Sometimes", score: 7 },
      { text: "Rarely", score: 3 },
      { text: "Never", score: 0 }
    ]
  },
  {
    id: "junkFood",
    question: "How often do you eat fried or packaged foods?",
    options: [
      { text: "Rarely", score: 10 },
      { text: "Weekly", score: 7 },
      { text: "3–4 times/week", score: 3 },
      { text: "Daily", score: 0 }
    ]
  }
];

const NutritionQuestionnaire = () => {
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const handleChange = (questionId, score) => {
    setAnswers({ ...answers, [questionId]: score });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    const dietScore = (totalScore / 10).toFixed(1);

    navigate("/dashboard", {
      state: { dietScore }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 flex justify-center py-10 px-4">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-3xl p-8 border border-pink-200">

        <h1 className="text-3xl font-bold text-center text-purple-600 mb-10">
          Maternal Nutrition Assessment
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {questions.map((q) => (
            <div key={q.id}>
              <h2 className="text-lg font-semibold text-purple-500 mb-3">
                {q.question}
              </h2>

              <div className="grid md:grid-cols-2 gap-3">
                {q.options.map((opt, i) => (
                  <label key={i} className="flex items-center gap-3 bg-pink-50 p-3 rounded-xl cursor-pointer">
                    <input
                      type="radio"
                      name={q.id}
                      required
                      onChange={() => handleChange(q.id, opt.score)}
                      className="accent-purple-500 w-5 h-5"
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition duration-300 shadow-lg"
          >
            Continue to AI Prediction
          </button>
        </form>

      </div>
    </div>
  );
};

export default NutritionQuestionnaire;
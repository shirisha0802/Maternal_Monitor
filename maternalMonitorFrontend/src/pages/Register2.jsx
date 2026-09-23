import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register2() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://127.0.0.1:8000/signup",
        {
          name: form.name,
          email: form.email,
          password: form.password,
        }
      );

      console.log("Registration Success:", response.data);

      alert("Registration successful! Please login.");

      navigate("/login");

    } catch (error) {
      console.error(error.response?.data);

      setError(
        error.response?.data?.detail ||
        "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-100 flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-purple-100 p-10">

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-purple-700">
            Patient Registration
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Create a new maternal health account
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-100 text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <FormField
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition duration-300 shadow-md disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register Patient"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-purple-600 font-semibold hover:underline"
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-2">
      {label}
    </label>

    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
    />
  </div>
);
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* VALIDATION */
  const phoneValid = /^\d{10}$/.test(form.phone);
  const hasUpper = /[A-Z]/.test(form.password);
  const hasLower = /[a-z]/.test(form.password);
  const hasNumber = /\d/.test(form.password);
  const hasLength = form.password.length >= 8;

  const passwordValid =
    hasUpper && hasLower && hasNumber && hasLength;

  const formValid =
    form.firstName &&
    form.lastName &&
    form.username &&
    phoneValid &&
    passwordValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) return;

    try {
      setLoading(true);

      // 🔥 Default trimester and appointment
      const today = new Date();
      const nextAppointment = new Date();
      nextAppointment.setDate(today.getDate() + 28); // 4 weeks

      const payload = {
        ...form,
        trimester: 1,
        nextAppointment: nextAppointment.toISOString(),
        medicalData: {
          age: null,
          systolicBP: null,
          diastolicBP: null,
          bloodSugar: null,
          heartRate: null,
          bodyTemp: null,
          bmi: null,
          hb: null,
          dietScore: null,
          protein: null,
          calcium: null,
          iron: null,
        },
      };

      const response = await axios.post(
        `${import.meta.env.VITE_REGISTER_API_URL}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const createdPatient = response.data;

      // 🔥 Redirect to patient details page
      navigate(`/patients/${createdPatient.id}`, {
        state: createdPatient,
      });

    } catch (error) {
      console.error(error.response?.data);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200 px-4">

      <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-2xl border border-purple-100">

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-purple-700">
            Patient Registration
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter patient details to create a new record
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* First Name */}
          <div>
            <label className="text-sm text-gray-600 font-medium">
              First Name
            </label>
            <input
              name="firstName"
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="text-sm text-gray-600 font-medium">
              Last Name
            </label>
            <input
              name="lastName"
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-sm text-gray-600 font-medium">
              Username
            </label>
            <input
              name="username"
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-600 font-medium">
              Phone Number
            </label>
            <input
              name="phone"
              onChange={handleChange}
              className={`mt-1 w-full p-3 border rounded-lg focus:outline-none ${
                form.phone === ""
                  ? "border-gray-300"
                  : phoneValid
                  ? "border-green-500"
                  : "border-red-500"
              }`}
            />
            {form.phone !== "" && !phoneValid && (
              <p className="text-red-500 text-xs mt-1">
                Phone must be exactly 10 digits
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600 font-medium">
              Password
            </label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              onChange={handleChange}
              className={`mt-1 w-full p-3 border rounded-lg focus:outline-none ${
                form.password === ""
                  ? "border-gray-300"
                  : passwordValid
                  ? "border-green-500"
                  : "border-red-500"
              }`}
            />
          </div>

          {/* Password Rules */}
          <div className="text-xs space-y-1">
            <p className={hasUpper ? "text-green-500" : "text-red-500"}>
              • One uppercase letter
            </p>
            <p className={hasLower ? "text-green-500" : "text-red-500"}>
              • One lowercase letter
            </p>
            <p className={hasNumber ? "text-green-500" : "text-red-500"}>
              • One number
            </p>
            <p className={hasLength ? "text-green-500" : "text-red-500"}>
              • Minimum 8 characters
            </p>
          </div>

          {/* Show Password */}
          <label className="flex items-center text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) =>
                setShowPassword(e.target.checked)
              }
              className="mr-2"
            />
            Show Password
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={!formValid || loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              formValid
                ? "bg-pink-500 hover:bg-pink-600 shadow-md"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Creating Patient..." : "Register Patient"}
          </button>

        </form>
      </div>
    </div>
  );
}
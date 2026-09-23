import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const loginValid =
    form.email.trim() !== "" &&
    form.password.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginValid) return;

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `${process.env.LOGIN_API_URL}`,
        {
          email: form.email,
          password: form.password,
        }
      );

      console.log("Login Success:", response.data);

      // Save JWT token
      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      // Update Redux login state
      dispatch(login(response.data));

      alert("Login Successful ✅");

      // Go to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error(err.response?.data);

      setError(
        err.response?.data?.detail ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-teal-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        <h1 className="text-3xl font-bold text-center text-purple-700 mb-2">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Login to access the Maternal Health System
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-3 text-sm text-purple-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading || !loginValid}
            className="w-full bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;
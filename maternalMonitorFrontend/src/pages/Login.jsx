import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loginValid =
    form.username.trim() !== "" &&
    form.password.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginValid) return;

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:8080/user/login",
        {
          username: form.username,
          password: form.password,
        }
      );

      console.log("Login Success:", response.data);

      alert("Login Successful ✅");

      // Later you can store token or redirect
      // navigate("/dashboard");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans">

      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-1 relative bg-gradient-to-br from-purple-300 to-pink-300 items-center justify-center overflow-hidden">

        {/* Decorative Bubbles */}
        <div className="absolute w-40 h-40 bg-white/20 rounded-full top-[15%] left-[10%] animate-bounce"></div>
        <div className="absolute w-36 h-36 bg-white/20 rounded-full bottom-[15%] left-[25%] animate-pulse"></div>
        <div className="absolute w-40 h-40 bg-white/15 rounded-full top-[70%] right-[15%] animate-bounce"></div>
        <div className="absolute w-32 h-32 bg-white/15 rounded-full top-[10%] right-[5%] animate-pulse"></div>

        <div className="w-2/3 bg-white p-16 rounded-[25px] shadow-[0_30px_60px_rgba(0,0,0,0.15)] text-center z-10">
          <h1 className="text-[40px] text-purple-800 font-bold">
            Maternal Care
          </h1>
          <p className="text-gray-600 mt-3">
            Intelligent maternal health monitoring platform 🤍
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-1 bg-purple-50 items-center justify-center px-6">

        <div className="w-[380px] bg-white p-[35px] rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.08)]">

          <h2 className="text-center text-2xl text-purple-700 mb-5 font-semibold">
            Secure Login
          </h2>

          {error && (
            <p className="text-red-500 text-sm text-center mb-3">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col">

            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="mb-3 p-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
            />

            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="mb-3 p-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
            />

            <label className="text-sm mb-3 flex items-center text-gray-600">
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

            <button
              type="submit"
              disabled={!loginValid || loading}
              className={`mt-2 p-3 rounded-lg text-white font-medium transition ${
                loginValid
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-purple-600 opacity-60 cursor-not-allowed"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default Login;
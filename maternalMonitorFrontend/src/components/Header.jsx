import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navStyle = ({ isActive }) =>
    isActive
      ? "text-purple-700 font-semibold"
      : "text-gray-600 hover:text-purple-600 transition";

  return (
    <header className="w-full bg-white shadow-md border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo Section */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center space-x-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg">
            MC
          </div>
          <div>
            <h1 className="text-lg font-bold text-purple-700">
              Maternal Care System
            </h1>
            <p className="text-xs text-gray-500">
              AI-driven Maternal Health Monitoring
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">

          <NavLink to="/" className={navStyle}>
            Home
          </NavLink>

          <NavLink to="/dashboard" className={navStyle}>
            Predict AI
          </NavLink>

          <NavLink to="/register" className={navStyle}>
            Register Patient
          </NavLink>

        

          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 transition font-medium"
          >
            Logout
          </button>

        </nav>
      </div>
    </header>
  );
}
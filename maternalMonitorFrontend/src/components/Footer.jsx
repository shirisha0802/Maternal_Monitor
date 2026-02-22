import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-purple-200 to-pink-200 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-6 text-center">

        <p className="text-purple-800 font-semibold">
          Maternal Care Monitoring System
        </p>

        <p className="text-sm text-gray-600 mt-1">
          Supporting safer pregnancies through AI-driven risk assessment.
        </p>

        <div className="mt-3 text-xs text-gray-500">
          © {new Date().getFullYear()} Maternal Care | Built for Healthcare Innovation
        </div>

      </div>
    </footer>
  );
}
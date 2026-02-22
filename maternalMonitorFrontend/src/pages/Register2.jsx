import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register2() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const today = new Date();
    const nextAppointment = new Date();
    nextAppointment.setDate(today.getDate() + 28);

    const createdPatient = {
      id: Date.now(),
      ...form,
      trimester: 1,
      nextAppointment: nextAppointment.toDateString(),
    };

    navigate(`/patients/${createdPatient.id}`, {
      state: createdPatient,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-purple-100 p-10">

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-purple-700">
            Patient Registration
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Create a new maternal health profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <FormField label="First Name" name="firstName" onChange={handleChange} />
          <FormField label="Last Name" name="lastName" onChange={handleChange} />
          <FormField label="Username" name="username" onChange={handleChange} />
          <FormField label="Phone Number" name="phone" onChange={handleChange} />
          <FormField label="Password" name="password" type="password" onChange={handleChange} />

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition duration-300 shadow-md"
          >
            Register Patient
          </button>

        </form>
      </div>
    </div>
  );
}

const FormField = ({ label, name, type = "text", onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-2">
      {label}
    </label>
    <input
      name={name}
      type={type}
      onChange={onChange}
      required
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
    />
  </div>
);
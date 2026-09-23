import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";

import App from "./App.jsx";
import AuthLayout from "./components/AuthLayout.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import MaternalDashboard from "./pages/MaternalDashboard.jsx";
import PatientDetails from "./pages/PatientDetails.jsx";
import EmergencySymptoms from "./pages/EmergencySymptoms.jsx";
import NutritionQuestionnaire from "./pages/NutritionQuestionnaire.jsx";
import Register2 from "./pages/Register2.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [

      // Home Page
      {
        index: true,
        element: <Home />,
      },

      // Login - Public
      {
        path: "login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },

      // Register - Public
      {
        path: "register",
        element: (
          <AuthLayout authentication={false}>
            <Register2 />
          </AuthLayout>
        ),
      },

      // Nutrition Questionnaire - Protected
      {
        path: "mcq",
        element: (
          <AuthLayout authentication={true}>
            <NutritionQuestionnaire />
          </AuthLayout>
        ),
      },

      // Dashboard - Protected
      {
        path: "dashboard",
        element: (
          <AuthLayout authentication={true}>
            <MaternalDashboard />
          </AuthLayout>
        ),
      },

      // Assessment History - Protected
      {
        path: "patients/history",
        element: (
          <AuthLayout authentication={true}>
            <PatientDetails />
          </AuthLayout>
        ),
      },

      // Patient Details - Protected
      {
        path: "patients/:id",
        element: (
          <AuthLayout authentication={true}>
            <PatientDetails />
          </AuthLayout>
        ),
      },

      // Emergency Symptoms - Protected
      {
        path: "emergencySymptoms",
        element: (
          <AuthLayout authentication={true}>
            <EmergencySymptoms />
          </AuthLayout>
        ),
      },

    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
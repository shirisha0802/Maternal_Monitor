import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";

import App from "./App.jsx";
import AuthLayout from "./components/AuthLayout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import MaternalDashboard from "./pages/MaternalDashboard.jsx";
import PatientDetails from "./pages/PatientDetails.jsx"; // ✅ Added
import EmergencySymptoms from "./pages/EmergencySymptoms.jsx";
import NutritionQuestionnaire from "./pages/NutritionQuestionnaire.jsx";
import Register2 from "./pages/Register2.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Layout component (must contain <Outlet />)
    children: [

      // ✅ Default Route → Home Page
      {
        index: true,
        element: <Home />,
      },

      // ✅ Login Route (Public)
      {
        path: "login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },

      // ✅ Register Route (Public)
      {
        path: "register",
        element: (
          <AuthLayout authentication={false}>
            <Register2 />
          </AuthLayout>
        ),
      },
      
      {
        path: "mcq",
        element: (
          <AuthLayout authentication={false}>
            <NutritionQuestionnaire />
          </AuthLayout>
        ),
      },

      // ✅ Dashboard Route (Protected)
      {
        path: "dashboard",
        element: (
          <AuthLayout authentication={false}>
            <MaternalDashboard />
          </AuthLayout>
        ),
      },

      // ✅ Patient Details Route (Protected)
      {
        path: "patients/:id",
        element: (
          <AuthLayout authentication={false}>
            <PatientDetails />
          </AuthLayout>
        ),
      },
      {
        path: "emergencySymptoms",
        element: (
          <AuthLayout authentication={false}>
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
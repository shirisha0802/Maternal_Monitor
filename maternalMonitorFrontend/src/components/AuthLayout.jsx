import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate();

  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (authentication && !authStatus) {
      navigate("/login", { replace: true });
    }

    if (!authentication && authStatus) {
      navigate("/dashboard", { replace: true });
    }
  }, [authStatus, authentication, navigate]);

  // Protected page + user is not logged in
  if (authentication && !authStatus) {
    return null;
  }

  // Login/Register page + user is already logged in
  if (!authentication && authStatus) {
    return null;
  }

  return <>{children}</>;
}
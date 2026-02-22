import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (authentication && !authStatus) {
      navigate("/login", { replace: true });
    }

    if (!authentication && authStatus) {
      navigate("/", { replace: true });
    }
  }, [authStatus, authentication, navigate]);

  if (authentication && !authStatus) return null;
  if (!authentication && authStatus) return null;

  return <>{children}</>;
}
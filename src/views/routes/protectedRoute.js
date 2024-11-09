import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "context/authContext";

const ProtectedRoute = ({ component: Component }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;

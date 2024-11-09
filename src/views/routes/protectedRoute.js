import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "context/authContext";

const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, role } = useAuth();
  console.log(role);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/notFound" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;

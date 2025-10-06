import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);
  const storedUser = JSON.parse(localStorage.getItem("userToken"));

  const normalizeRole = (r) => (r ? r.toLowerCase().replace(/\s+/g, "_") : "");

  const userRole = normalizeRole(role);

  if (!isAuthenticated || !storedUser?.token) {
    return <Navigate to="/login" replace />;
  }

  const isTemporaryPassword =
    storedUser?.isTemporaryPassword || user?.isTemporaryPassword;
  if (isTemporaryPassword) {
    return <Navigate to="/change-password" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.map((r) => normalizeRole(r)).includes(userRole)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
import React from "react";
import { Navigate } from "react-router-dom";
import Dashboard from "./page/Dashboard";

const authMiddleware = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
 
  return <Dashboard />;
};

export default authMiddleware;

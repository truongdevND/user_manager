import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "../page/Login";
import Register from "../page/Register";
import Dashboard from "../page/Dashboard";
import NotFound from "../page/NotFound";
// import authMiddleware from "../authMiddleware";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
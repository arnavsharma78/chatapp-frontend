import React from "react";
import { Navigate, Outlet } from "react-router-dom";
//outlet just render any random page after the route

const ProtectRoute = ({ children, user, redirect = "/login" }) => {
  if (!user) return <Navigate to={redirect} />;
  return children ? children : <Outlet />;
};

export default ProtectRoute;

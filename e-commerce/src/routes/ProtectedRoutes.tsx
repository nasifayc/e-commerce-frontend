import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;

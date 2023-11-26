import { Navigate } from "react-router-dom";
import useRefreshToken from "../hooks/auth/useRefreshToken.js";
import { useAuth } from "../context/AuthProvider";
import React from "react";

type ProtectedRouteProps = {
  children: React.ReactNode;
  redirectPath?: string;
};

function ProtectedRoute({
  children,
  redirectPath = "/connexion",
}: ProtectedRouteProps) {
  const { accessToken } = useAuth();
  const refresh = useRefreshToken();

  if (!accessToken) {
    const getNewAccessToken = async () => {
      const { accessToken: newAccessToken } = await refresh();

      console.log(newAccessToken);

      if (!newAccessToken) {
        return <Navigate to={redirectPath} replace />;
      } else {
        return children;
      }
    };

    getNewAccessToken();
  }

  return children;
}

export default ProtectedRoute;

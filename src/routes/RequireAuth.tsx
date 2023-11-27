import { useAuth } from "../context/AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function RequireAuth() {
  const { accessToken } = useAuth();
  const location = useLocation();

  return (
    <>
      {accessToken ? (
        <Outlet />
      ) : (
        <Navigate to="/connexion" state={{ from: location }} />
      )}
    </>
  );
}

export default RequireAuth;

import {Navigate} from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "../hooks/auth/useAuth.js";
import useRefreshToken from "../hooks/auth/useRefreshToken.js";

function ProtectedRoute({children, redirectPath = "/connexion"}) {
  const {accessToken} = useAuth()
  const refresh = useRefreshToken()

  if (!accessToken) {
    async () => {
      const {newAccessToken} = await refresh()

      if (!newAccessToken) {
        return <Navigate to={redirectPath} replace />;
      } else {
        return children
      }
    }
  }

  return children;
}

ProtectedRoute.propTypes = {
  redirectPath: PropTypes.string,
  children: PropTypes.node,
}

export default ProtectedRoute;
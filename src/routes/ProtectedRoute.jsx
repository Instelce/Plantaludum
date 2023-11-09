import {Navigate} from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "../hooks/auth/useAuth.js";
import useRefreshToken from "../hooks/auth/useRefreshToken.js";

function ProtectedRoute({children, redirectPath = "/connexion"}) {
  const {accessToken} = useAuth()
  const refresh = useRefreshToken()

  if (!accessToken) {
    const getNewAccessToken = async () => {
      const {newAccessToken} = await refresh()

      console.log(newAccessToken)

      if (!newAccessToken) {
        return <Navigate to={redirectPath} replace />;
      } else {
        return children
      }
    }

    getNewAccessToken()
  }

  return children;
}

ProtectedRoute.propTypes = {
  redirectPath: PropTypes.string,
  children: PropTypes.node,
}

export default ProtectedRoute;
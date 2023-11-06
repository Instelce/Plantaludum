import {createContext, useState} from "react";
import PropTypes from "prop-types";


const AuthContext = createContext({
  user: {},
  setUser: () => {},
  accessToken: null,
  refreshToken: null,
  csrftoken: null,
  setAccessToken: () => null,
  setRefreshToken: () => null,
  setCSRFToken: () => null
})


export function AuthProvider ({children}) {

  const [user, setUser] = useState({})
  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [CSRFToken, setCSRFToken] = useState(null)

  return (
    <AuthContext.Provider value={{
      user, setUser,
      accessToken, setAccessToken,
      refreshToken, setRefreshToken,
      CSRFToken: CSRFToken, setCSRFToken: setCSRFToken
    }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node
}

export default AuthContext;
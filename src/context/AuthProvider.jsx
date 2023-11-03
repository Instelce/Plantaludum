import {createContext, useState} from "react";
import PropTypes from "prop-types";


const AuthContext = createContext({})


export function AuthProvider ({children}) {
  const [auth, setAuth] = useState({})

  return (
    <AuthContext.Provider value={{auth, setAuth}}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node
}

export default AuthContext;
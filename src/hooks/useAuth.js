import React, {useContext} from 'react';
import AuthContext from "../context/AuthProvider.jsx";

function UseAuth() {
  return useContext(AuthContext)
}

export default UseAuth;
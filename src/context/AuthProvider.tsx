import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { User } from "../services/api/types/users";

type AuthContextType = {
  user: User | {};
  setUser: React.Dispatch<React.SetStateAction<User | {}>>;
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  refreshToken: string | null;
  setRefreshToken: React.Dispatch<React.SetStateAction<string | null>>;
  CSRFToken: string | null;
  setCSRFToken: React.Dispatch<React.SetStateAction<string | null>>;
};

const AuthContext = createContext<AuthContextType>({
  user: {},
  setUser: () => {},
  accessToken: null,
  setAccessToken: () => null,
  refreshToken: null,
  setRefreshToken: () => null,
  CSRFToken: null,
  setCSRFToken: () => null,
});

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [CSRFToken, setCSRFToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        CSRFToken: CSRFToken,
        setCSRFToken: setCSRFToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { User } from "../services/api/types/users";
import set = gsap.set;

type AuthContextType = {
  user: User | {};
  setUser: React.Dispatch<React.SetStateAction<User | {}>>;
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  CSRFToken: string | null;
  setCSRFToken: React.Dispatch<React.SetStateAction<string | null>>;
  persist: boolean;
  setPersist: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthContext = createContext<AuthContextType>({
  user: {},
  setUser: () => {},
  accessToken: null,
  setAccessToken: () => null,
  CSRFToken: null,
  setCSRFToken: () => null,
  persist: false,
  setPersist: () => false,
});

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [CSRFToken, setCSRFToken] = useState<string | null>(null);
  const [persist, setPersist] = useState<boolean>(
    JSON.parse(localStorage.getItem("persist") as string) || false,
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
        CSRFToken: CSRFToken,
        setCSRFToken: setCSRFToken,
        persist: persist,
        setPersist: setPersist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

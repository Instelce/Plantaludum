import usePrivateFetch from "./usePrivateFetch.js";
import { useAuth } from "../../context/AuthProvider";
import { auth } from "../../services/api/auth";

export default function useLogout() {
  const { setUser, setAccessToken, setCSRFToken } = useAuth();
  const privateFetch = usePrivateFetch();

  const logout = async () => {
    try {
      const response = await auth.logout(privateFetch);

      setAccessToken(null);
      setCSRFToken(null);
      setUser({});
    } catch (error) {
      console.log(error);
    }
  };

  return logout;
}

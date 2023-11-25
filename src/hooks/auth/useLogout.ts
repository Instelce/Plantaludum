import usePrivateFetch from "./usePrivateFetch.js";
import { useAuth } from "../../context/AuthProvider";

export default function useLogout() {
  const { setUser, setAccessToken, setCSRFToken } = useAuth();
  const privateFetch = usePrivateFetch();

  const logout = async () => {
    try {
      const response = await privateFetch.post("auth/logout");

      setAccessToken(null);
      setCSRFToken(null);
      setUser({});
    } catch (error) {
      console.log(error);
    }
  };

  return logout;
}

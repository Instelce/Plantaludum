import usePrivateFetch from "./usePrivateFetch.js";
import { useAuth } from "../../context/AuthProvider";

function useUser() {
  const { setUser } = useAuth();
  const privateFetch = usePrivateFetch();

  const getUser = async () => {
    try {
      const { data } = await privateFetch.get("api/auth/user");
      setUser(data);
      localStorage.setItem("USER-ID", data.id);
    } catch (error) {
      console.log("user", error);
    }
  };

  return getUser;
}

export default useUser;

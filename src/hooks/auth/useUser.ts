import usePrivateFetch from "./usePrivateFetch.js";
import { useAuth } from "../../context/AuthProvider";
import { useEffect } from "react";

function useUser() {
  const { user, setUser } = useAuth();
  const privateFetch = usePrivateFetch();

  const getUser = async () => {
    try {
      const { data } = await privateFetch.get("api/auth/user");
      setUser(data);
    } catch (error) {
      console.log("user", error);
    }
  };

  useEffect(() => {
    if (Object.values(user).length === 0) {
      getUser();
    }
  }, []);

  return user;
}

export default useUser;

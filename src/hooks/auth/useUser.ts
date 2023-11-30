import usePrivateFetch from "./usePrivateFetch.js";
import { useAuth } from "../../context/AuthProvider";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { auth } from "../../services/api";

function useUser() {
  const { setUser } = useAuth();
  const privateFetch = usePrivateFetch();

  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await auth.user(privateFetch);
      setUser(response.data);
      return response.data;
    },
  });

  return userQuery.data;
}

export default useUser;
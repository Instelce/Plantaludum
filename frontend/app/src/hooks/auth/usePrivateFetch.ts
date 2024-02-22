import { apiPrivate } from "../../services/api/axios.js";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken.js";
import { useAuth } from "../../context/AuthProvider";
import { AxiosInstance } from "axios";

export default function usePrivateFetch(): AxiosInstance {
  const { accessToken, setAccessToken, CSRFToken, user } = useAuth();
  const refresh = useRefreshToken();

  useEffect(() => {
    const requestIntercept = apiPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
          config.headers["X-CSRFToken"] = CSRFToken;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseIntercept = apiPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (
          (error?.response?.status === 403 ||
            error?.response?.status === 401) &&
          !prevRequest?.sent
        ) {
          console.log("New access token");
          prevRequest.sent = true;
          const { csrfToken: newCSRFToken, accessToken: newAccessToken } = await refresh();
          setAccessToken(newAccessToken);
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          prevRequest.headers["X-CSRFToken"] = newCSRFToken;
          return apiPrivate(prevRequest);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      apiPrivate.interceptors.request.eject(requestIntercept);
      apiPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, user]);

  return apiPrivate;
}

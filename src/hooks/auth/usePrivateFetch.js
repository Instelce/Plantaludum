import {privateFetch} from "../../api/axios.js";
import { useEffect } from 'react'
import useAuth from "./useAuth.js";
import useRefreshToken from "./useRefreshToken.js";

export default function usePrivateFetch() {

  const { accessToken, setAccessToken, csrftoken, user } = useAuth()
  const refresh = useRefreshToken()

  useEffect(() => {
    const requestIntercept = privateFetch.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
          config.headers['X-CSRFToken'] = csrftoken
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    const responseIntercept = privateFetch.interceptors.response.use(
      response => response,
      async (error) => {
        const prevRequest = error?.config;
        if ((error?.response?.status === 403 || error?.response?.status === 401) && !prevRequest?.sent) {
          prevRequest.sent = true;
          const { csrfToken: newCSRFToken, accessToken: newAccessToken } = await refresh();
          setAccessToken(newAccessToken)
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          prevRequest.headers['X-CSRFToken'] = newCSRFToken
          return privateFetch(prevRequest)
        }
        return Promise.reject(error);
      }
    )

    return () => {
      privateFetch.interceptors.request.eject(requestIntercept)
      privateFetch.interceptors.response.eject(responseIntercept)
    }
  }, [accessToken, user])

  return privateFetch
}

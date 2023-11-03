import defaultFetch, {axiosPrivate, privateFetch} from "../api/axios.js";
import useRefreshToken from "./useRefreshToken.js";
import useAuth from "./useAuth.js";
import {useEffect} from "react";

function usePrivateFetch() {
  const refresh = useRefreshToken()
  const {auth} = useAuth()

  useEffect(() => {

    const requestIntercept = privateFetch.interceptors.request.use(
      config => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    const responceIntercept = privateFetch.interceptors.response.use(
      response => response,
      async (error) => {
        const prevRequest = error?.config;

        console.log(prevRequest)

        // get new access token if it's expired and resend previous request with the new access token
        if (error?.config?.status === 403 && !prevRequest.send) {
          prevRequest.send = true;
          const newAccessToken = refresh();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          return privateFetch(prevRequest)
        }

        return Promise.reject(error)
      }
    )

    return () => {
      defaultFetch.interceptors.request.eject(requestIntercept)
    }
  }, [auth, refresh]);

  return axiosPrivate;
}

export default usePrivateFetch;
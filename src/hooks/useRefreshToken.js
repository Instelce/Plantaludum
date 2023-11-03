import useAuth from "./useAuth.js";
import defaultFetch from "../api/axios.js";

function useRefreshToken() {
  const {setAuth} = useAuth()

  const refresh = async () => {

    // get refresh token and store it in httponly cookie
    const response = await defaultFetch.get('/token/refresh', {
      withCredentials: true
    })

    setAuth(prev => {
      return {...prev, accessToken: response.data.accessToken}
    })

    return response.data.accessToken;
  }

  return refresh
}

export default useRefreshToken;
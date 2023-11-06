import defaultFetch from "../api/axios.js";
import useAuth from "./useAuth";

export default function useRefreshToken() {
  const { setAccessToken, setCSRFToken } = useAuth()

  const refresh = async () => {
    const response = await defaultFetch.post('auth/refresh')
    setAccessToken(response.data.access)
    setCSRFToken(response.headers["x-csrftoken"])

    return { accessToken: response.data.access, csrfToken: response.headers["x-csrftoken"] }
  }

  return refresh
}

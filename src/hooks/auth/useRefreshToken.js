import api from "../../api/axios.js";
import useAuth from "./useAuth.js";

export default function useRefreshToken() {
  const { setAccessToken, setCSRFToken } = useAuth()

  const refresh = async () => {
    const response = await api.post('auth/refresh')
    setAccessToken(response.data.access)
    setCSRFToken(response.headers["x-csrftoken"])

    return { accessToken: response.data.access, csrfToken: response.headers["x-csrftoken"] }
  }

  return refresh
}

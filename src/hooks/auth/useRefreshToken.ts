import api from "../../services/api/axios.js";
import { useAuth } from "../../context/AuthProvider";

export default function useRefreshToken() {
  const { setAccessToken, setCSRFToken } = useAuth();

  const refresh = async () => {
    const response = await api.post(
      "auth/refresh",
      {},
      {
        withCredentials: true,
      },
    );
    setAccessToken(response.data.access);
    setCSRFToken(response.headers["x-csrftoken"]);

    return {
      accessToken: response.data.access,
      csrfToken: response.headers["x-csrftoken"],
    };
  };

  return refresh;
}

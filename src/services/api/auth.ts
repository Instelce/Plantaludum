import { LoginFormDataType, RegisterFormDataType } from "./types/users";
import { apiRequest } from "./axios";
import { AxiosInstance } from "axios/index";

export const auth = {
  login: (data: LoginFormDataType) =>
    apiRequest.post("api/auth/login", data, { withCredentials: true }),
  register: (data: RegisterFormDataType) =>
    apiRequest.post("api/auth/register", data, { withCredentials: true }),
  logout: (privateFetch: AxiosInstance) => privateFetch.post("api/auth/logout"),
  user: (privateFetch: AxiosInstance) => privateFetch.get("api/auth/user"),
};

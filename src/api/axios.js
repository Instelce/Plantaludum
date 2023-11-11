import axios from "axios"


const api = axios.create({
  baseURL: import.meta.env.VITE_PLANTALUDUM_API_URL,
  withCredentials: true,
  headers: {'Content-Type': 'application/json; utf-8'},
})

export const apiPrivate = axios.create({
  baseURL: import.meta.env.VITE_PLANTALUDUM_API_URL,
  withCredentials: true,
  headers: {'Content-Type': 'application/json; utf-8'},
})

export const apiFlore = axios.create({
  baseURL: import.meta.env.VITE_FLORE_API_URL,
})

export default api;
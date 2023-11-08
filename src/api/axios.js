import axios from "axios"


const defaultFetch = axios.create({
  baseURL: import.meta.env.VITE_PLANTALUDUM_API_URL,
  withCredentials: true,
  headers: {'Content-Type': 'application/json; utf-8'},
})

export const privateFetch = axios.create({
  baseURL: import.meta.env.VITE_PLANTALUDUM_API_URL,
  withCredentials: true,
  headers: {'Content-Type': 'application/json; utf-8'},
})

export const floreFetch = axios.create({
  baseURL: 'http://127.0.0.1:8001/',
})

export default defaultFetch;
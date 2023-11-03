import axios from "axios"


const BASE_URL = 'http://127.0.0.1:8000'

const defaultFetch = axios.create({
  baseURL: BASE_URL,
  headers: {'Content-Type': 'application/json'},
})

export const privateFetch = axios.create({
  baseURL: BASE_URL,
  headers: {'Content-Type': 'application/json'},
  withCredentials: true
})

export const floreFetch = axios.create({
  baseURL: 'http://127.0.0.1:8001',
})

export default defaultFetch;
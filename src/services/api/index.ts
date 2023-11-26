import { apiFlore, apiPrivateRequest, apiRequest } from "./axios";
import { LoginFormDataType, RegisterFormDataType } from "./types/users";
import {
  CreateDeckFormDataType,
  CreateDeckPlantFormDataType,
  DeckType,
} from "./types/decks";
import { AxiosInstance, AxiosRequestConfig } from "axios";

// -----------------------------------------------------------------------------
// AUTH PLANTALUDUM API
// -----------------------------------------------------------------------------

export const auth = {
  login: (data: LoginFormDataType) =>
    apiRequest.post("api/auth/login", data, { withCredentials: true }),
  register: (data: RegisterFormDataType) =>
    apiRequest.post("api/auth/register", data, { withCredentials: true }),
  logout: () => apiPrivateRequest.post("api/auth/logout"),
};

// -----------------------------------------------------------------------------
// PLANTALUDUM API
// -----------------------------------------------------------------------------

export const decks = {
  list: () => apiRequest.get("/api/decks").then((r) => r.data),
  //
  details: (deckId: number) =>
    apiRequest.get(`/api/decks/${deckId}`).then((r) => r.data),
  //
  listPlants: (deckId: number) =>
    apiRequest.get(`/api/decks/${deckId}/plants`).then((r) => r.data),

  create: (privateFetch: AxiosInstance, data: CreateDeckFormDataType) =>
    privateFetch.post("/api/decks", data).then((r) => r.data),
  //
  update: (privateFetch: AxiosInstance, deckId: number, data: DeckType) =>
    privateFetch.patch(`/api/decks/${deckId}`, data).then((r) => r.data),
  //
  delete: (privateFetch: AxiosInstance, deckId: number) =>
    privateFetch.delete(`/api/decks/${deckId}`).then((r) => r.data),
  //
  createPlant: (
    privateFetch: AxiosInstance,
    data: CreateDeckPlantFormDataType,
  ) => privateFetch.post(`/api/decks-plants`, data).then((r) => r.data),
  //
  deletePlant: (privateFetch: AxiosInstance, deckId: number, plantId: number) =>
    privateFetch
      .delete(`/api/decks/${deckId}/plants/${plantId}`)
      .then((r) => r.data),
};

// -----------------------------------------------------------------------------
// FLORE API
// -----------------------------------------------------------------------------

export function loadRandomPlants(number = 10) {
  return apiFlore.get(`api/plants/random/${number}`).then((r) => r.data);
}

export function loadPlants({
  search = null,
  fieldFilters = {
    rank_code: null,
    family__name: null,
    genre__name: null,
    author: null,
  },
}) {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  for (const [key, value] of Object.entries(fieldFilters)) {
    if (value !== null) {
      params.set(key, value);
    }
  }

  return apiFlore.get(`api/plants?${params.toString()}`).then((r) => r.data);
}

export function loadPlantsIdsList(ids: number[]) {
  const params = new URLSearchParams();

  params.set("ids", ids.join(","));

  return apiFlore
    .get(`api/plants-list?${params.toString()}`)
    .then((r) => r.data);
}

export function loadPlantsIdsListImages(ids: number[]) {
  const params = new URLSearchParams();

  params.set("ids", ids.join(","));

  return apiFlore
    .get(`api/plants-list/images?${params.toString()}`)
    .then((r) => r.data);
}

export function loadImages(
  fieldFilters = {
    plant__id: null,
    plant__french_name: null,
    organ: null,
  },
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(fieldFilters)) {
    if (value !== null) {
      params.set(key, value);
    }
  }

  console.log(params.toString());

  return apiFlore.get(`api/images?${params.toString()}`).then((r) => r.data);
}

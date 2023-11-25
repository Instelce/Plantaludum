import { apiFlore, apiPrivateRequest, apiRequest } from "./axios";
import { LoginFormDataType, RegisterFormDataType } from "./types/users";
import {
  CreateDeckFormDataType,
  CreateDeckPlantFormDataType,
  DeckType,
} from "./types/decks";

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
  list: () => apiRequest.get("/api/decks"),
  //
  details: (deckId: number) => apiRequest.get(`/api/decks/${deckId}`),
  //
  listPlants: (deckId: number) => apiRequest.get(`/api/decks/${deckId}/plants`),

  create: (data: CreateDeckFormDataType) =>
    apiPrivateRequest.post("/api/decks", data),
  //
  update: (deckId: number, data: DeckType) =>
    apiPrivateRequest.patch(`/api/decks/${deckId}`, data),
  //
  delete: (deckId: number) => apiPrivateRequest.delete(`/api/decks/${deckId}`),
  //
  createPlant: (data: CreateDeckPlantFormDataType) =>
    apiPrivateRequest.post(`/api/decks/create-plant`, data),
  //
  deletePlant: (deckId: number, plantId: number) =>
    apiPrivateRequest.delete(`/api/decks/${deckId}/plants/${plantId}`),
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

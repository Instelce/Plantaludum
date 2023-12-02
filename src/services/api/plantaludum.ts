import {apiRequest} from "./axios";
import {AxiosInstance} from "axios/index";
import {
  CreateDeckFormDataType,
  CreateDeckPlantFormDataType,
  DeckType,
  UpdateDeckFormDataType,
} from "./types/decks";
import {PaginationResponseType} from "./index";
import {PlantType} from "./types/plants";
import {UserType} from "./types/users";

type DeckListArgsType = {
  search?: string | null;
  pageParam?: number | null;
}

export const decks = {
  list: async ({search, pageParam}: DeckListArgsType) => {
    const params = new URLSearchParams()
    if (pageParam) {
      params.set("page", pageParam.toString())
    }
    if (search) {
      params.set("search", search)
    }
    const r = await apiRequest.get(`/api/decks?${params}`)
    console.log(">>", r.data, pageParam)
    return r.data as PaginationResponseType<DeckType>
  },
  //
  details: (deckId: number) =>
    apiRequest.get(`/api/decks/${deckId}`).then((r) => {
      return r.data as DeckType;
    }),
  //
  create: (privateFetch: AxiosInstance, data: CreateDeckFormDataType) =>
    privateFetch.post("/api/decks", data).then((r) => r.data),
  //
  update: (privateFetch: AxiosInstance, deckId: string, data: UpdateDeckFormDataType) =>
    privateFetch.patch(`/api/decks/${deckId}`, data).then((r) => r.data),
  //
  delete: (privateFetch: AxiosInstance, deckId: number) =>
    privateFetch.delete(`/api/decks/${deckId}`).then((r) => r.data),

  listPlants: (deckId: number) =>
    apiRequest.get(`/api/decks/${deckId}/plants`).then((r) => {
      return r.data as PlantType[];
    }),
  //
  createPlant: (
    privateFetch: AxiosInstance,
    data: CreateDeckPlantFormDataType,
  ) => privateFetch.post(`/api/decks/plants`, data).then((r) => r.data),
  //
  deletePlant: (privateFetch: AxiosInstance, deckId: number, plantId: number) =>
    privateFetch
      .delete(`/api/decks/${deckId}/plants/${plantId}`)
      .then((r) => r.data),
};


export const users = {
  details: (userId: number) =>
    apiRequest.get(`/api/users/${userId}`).then((r) => {
      return r.data as UserType;
    }),
  listPlayedDecks: (userId: number) =>
    apiRequest.get(`/api/users/${userId}/played_decks`).then((r) => {r.data}),
  createPlayedDecks: (privateFetch: AxiosInstance, userId: number) =>
    privateFetch.post(`/api/users/${userId}/played_decks`).then((r) => {r.data}),
  updatePlayedDecks: (privateFetch: AxiosInstance, userId: number) =>
    privateFetch.patch(`/api/users/${userId}/played_decks`).then((r) => {r.data})
}
import { apiRequest } from "./axios";
import { AxiosInstance } from "axios/index";
import {
  CreateDeckFormDataType,
  CreateDeckPlantFormDataType,
  DeckType, UpdateDeckFormDataType,
} from "./types/decks";
import {PaginationResponseType} from "./index";
import {PlantType} from "./types/plants";

export const decks = {
  list: async (pageParam?: number) => {
    const params = new URLSearchParams()
    if (pageParam) {
      params.set("page", pageParam.toString())
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
  listPlants: (deckId: number) =>
    apiRequest.get(`/api/decks/${deckId}/plants`).then((r) => {
      return r.data as PlantType[];
    }),

  create: (privateFetch: AxiosInstance, data: CreateDeckFormDataType) =>
    privateFetch.post("/api/decks", data).then((r) => r.data),
  //
  update: (privateFetch: AxiosInstance, deckId: string, data: UpdateDeckFormDataType) =>
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

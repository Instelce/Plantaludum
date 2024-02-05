import { apiRequest } from "../axios";
import { PaginationResponseType } from "../types/pagination";
import {
  CreateDeckFormDataType,
  CreateDeckPlantFormDataType,
  DeckType,
  UpdateDeckFormDataType,
} from "../types/decks";
import { AxiosInstance } from "axios";
import { PlantType } from "../types/plants";

type DeckListArgsType = {
  search?: string | null;
  pageParam?: number | null;
  fieldFilters?: {
    private?: boolean | null;
    difficulty?: number | null;
    created_at?: Date | null;
    user__id?: number;
  };
};

export const decks = {
  list: async ({ search, pageParam, fieldFilters }: DeckListArgsType) => {
    const params = new URLSearchParams();
    if (pageParam) {
      params.set("page", pageParam.toString());
    }
    if (search) {
      params.set("search", search);
    }

    if (fieldFilters) {
      for (const [key, value] of Object.entries(fieldFilters)) {
        if (value !== null) {
          params.set(key, value.toString());
        }
      }
    }

    const r = await apiRequest.get(`/api/decks?${params}`);
    return r.data as PaginationResponseType<DeckType>;
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
  update: (
    privateFetch: AxiosInstance,
    deckId: string,
    data: UpdateDeckFormDataType,
  ) => privateFetch.patch(`/api/decks/${deckId}`, data).then((r) => r.data),
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

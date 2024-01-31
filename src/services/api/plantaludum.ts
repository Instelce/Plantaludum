import api, { apiRequest } from "./axios";
import { AxiosInstance } from "axios/index";
import {
  CreateDeckFormDataType,
  CreateDeckPlantFormDataType,
  DeckType,
  UpdateDeckFormDataType,
  UserPlayedDeckType,
} from "./types/decks";
import { PaginationResponseType } from "./types/pagination";
import { PlantType } from "./types/plants";
import { UserType } from "./types/users";

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

export const users = {
  details: (userId: number) =>
    apiRequest.get(`/api/auth/users/${userId}`).then((r) => {
      return r.data as UserType;
    }),
  update: (privateFetch: AxiosInstance, userId: number, data: object) =>
    privateFetch.patch(`/api/auth/users/${userId}`, data).then((r) => r.data),
  delete: (privateFetch: AxiosInstance, userId: number) =>
    privateFetch.delete(`/api/auth/users/${userId}`).then((r) => r.data),

  decks: ({
    userId,
    fieldFilters = {},
  }: {
    userId?: number;
    fieldFilters?: object;
  }) => {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(fieldFilters)) {
      if (value != null) {
        params.set(key, value.toString());
      }
    }

    console.log(fieldFilters, params);

    return api
      .get(`/api/user-decks/${userId}?${params}`)
      .then((r) => r.data as DeckType[]);
  },
  playedDecks: {
    list: (userId: number) =>
      api.get(`/api/users/${userId}/played_decks`).then((r) => {
        return r.data as UserPlayedDeckType[];
      }),
    details: (userId: number, deckId: number) =>
      api.get(`api/users/${userId}/played_decks/${deckId}`).then((r) => {
        return r.data as UserPlayedDeckType;
      }),
    create: (
      privateFetch: AxiosInstance,
      userId: number,
      data: { deck: number; level?: number; current_stars?: number },
    ) =>
      privateFetch.post(`/api/users/${userId}/played_decks`, data).then((r) => {
        return r.data;
      }),
    update: (
      privateFetch: AxiosInstance,
      userId: number,
      deckId: number,
      data: { level?: number; current_stars?: number },
    ) =>
      privateFetch
        .patch(`/api/users/${userId}/played_decks/${deckId}`, data)
        .then((r) => {
          return r.data;
        }),
  },
};

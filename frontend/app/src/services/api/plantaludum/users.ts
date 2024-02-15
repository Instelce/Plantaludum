import { AxiosInstance } from "axios";
import api, { apiRequest } from "../axios";
import { UserType } from "../types/users";
import { DeckType, UserPlayedDeckType } from "../types/decks";

export const users = {
  list: (privateFetch: AxiosInstance, pageParam: string) => {
    const params = new URLSearchParams();
    if (pageParam) {
      params.set("page", pageParam.toString());
    }
    return privateFetch.get(`/api/auth/users?${params}`).then((r) => r.data);
  },
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

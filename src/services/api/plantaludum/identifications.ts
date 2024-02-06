import { AxiosInstance } from "axios";
import {
  CreateIdentificationAnswerType, IdentificationAnswerType,
  IdentificationType, UpdateIdentificationType
} from "../types/identifications";
import {loadURLParams} from "../../../utils/helpers";

export default {
  list: (privateFetch: AxiosInstance, userId: number) =>
    privateFetch
      .get(`/api/identifications/user/${userId}`)
      .then((r) => r.data as IdentificationType[]),
  delete: (privateFetch: AxiosInstance, identificationId: number) =>
    privateFetch
      .delete(`/api/identifications/${identificationId}`)
      .then((r) => r.data),
  update: (privateFetch: AxiosInstance, identificationId: number | string, data: UpdateIdentificationType) => privateFetch.patch(`/api/identifications/${identificationId}`, data)
};

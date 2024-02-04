import {AxiosInstance} from "axios";
import {IdentificationType} from "../types/identifications";


export default {
  list: (privateFetch: AxiosInstance, userId: number) => privateFetch.get(`/api/identifications/${userId}`).then(r => r.data as IdentificationType[])
}

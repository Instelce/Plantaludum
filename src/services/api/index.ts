export { auth } from "./auth";
export { decks } from "./plantaludum";
export * as flore from "./flore";


export type PaginationResponseType<T> = {
  count: number;
  next: string;
  previous: string;
  results: T[];
}

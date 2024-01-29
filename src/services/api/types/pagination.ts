export type PaginationResponseType<T> = {
  count: number;
  next: string;
  previous: string;
  results: T[];
};

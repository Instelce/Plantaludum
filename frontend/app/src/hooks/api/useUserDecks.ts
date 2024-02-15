import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { users } from "../../services/api/plantaludum/users";

type UseUserDecksArgs = {
  id: number;
  fieldFilters?: object;
};

const useUserDecks = ({ id, fieldFilters }: UseUserDecksArgs) => {
  const userDecksQuery = useQuery({
    queryKey: ["user-decks", id],
    queryFn: () =>
      users.decks({
        userId: id,
        fieldFilters: fieldFilters,
      }),
    enabled: id != null,
  });

  // useEffect(() => {
  //   if (id) {
  //     userDecksQuery.refetch();
  //   }
  // }, [id]);

  return userDecksQuery;
};

export default useUserDecks;

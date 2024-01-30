import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { users } from "../../services/api/plantaludum";

type UseUserDecksArgs = {
  id: number,
  fieldFilters?: object
}

const useUserDecks = ({id, fieldFilters}: UseUserDecksArgs) => {
  const userDecksQuery = useQuery({
    queryKey: ["user-decks", id],
    queryFn: () => users.decks({
      userId: id,
      fieldFilters: fieldFilters
    }),
    enabled: false,
  });

  useEffect(() => {
    if (id) {
      console.log("Fetch to get user decks")
      console.log(id, userDecksQuery.data);
      userDecksQuery.refetch();
    }
  }, [id, userDecksQuery]);

  return userDecksQuery;
};

export default useUserDecks;

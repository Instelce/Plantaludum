import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { decks } from "../../services/api";
import { DeckType } from "../../services/api/types/decks";
import useUser from "../auth/useUser";
import { useEffect } from "react";
import { users } from "../../services/api/plantaludum";

const useUserDecks = (id: number) => {
  const userDecksQuery = useQuery({
    queryKey: ["user-decks", id],
    queryFn: () => users.decks(id as number),
    enabled: false,
  });

  useEffect(() => {
    if (id) {
      userDecksQuery.refetch();
      console.log(id, userDecksQuery.data);
    }
  }, [id]);

  return userDecksQuery;
};

export default useUserDecks;

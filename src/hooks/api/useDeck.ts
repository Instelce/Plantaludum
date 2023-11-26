import { useQueries, useQuery } from "@tanstack/react-query";
import {
  decks,
  loadPlantsIdsList,
  loadPlantsIdsListImages,
} from "../../services/api";
import { useEffect } from "react";
import { getObjectKeyValues } from "../../utils/helpers";

type UseDeckArgs = {
  deckId: string;
  fetchPlants?: boolean;
  fetchImages?: boolean;
};

function useDeck({
  deckId,
  fetchPlants = false,
  fetchImages = false,
}: UseDeckArgs) {
  const [deckQuery, deckPlantsQuery] = useQueries({
    queries: [
      {
        queryKey: ["decks", deckId],
        queryFn: () => decks.details(deckId),
        staleTime: 30_000,
      },
      {
        queryKey: ["decks-plants", deckId],
        queryFn: () => decks.listPlants(deckId),
      },
    ],
  });

  const plantsQuery = useQuery({
    queryKey: ["plants", deckId],
    queryFn: () =>
      loadPlantsIdsList(
        getObjectKeyValues(deckPlantsQuery.data, "plant_id"), // array of plant id
      ),
    staleTime: Infinity,
    enabled: false,
  });

  const plantsImagesQuery = useQuery({
    queryKey: ["plants-images", deckId],
    queryFn: () =>
      loadPlantsIdsListImages(
        getObjectKeyValues(deckPlantsQuery.data, "plant_id"),
      ),
    staleTime: Infinity,
    enabled: false,
  });

  // fetch quiz plants
  useEffect(() => {
    if (deckPlantsQuery.isSuccess && fetchPlants) {
      plantsQuery.refetch();
    }
  }, [deckPlantsQuery.isSuccess]);

  // fetch plants images
  useEffect(() => {
    if (plantsQuery.isSuccess && fetchImages) {
      plantsImagesQuery.refetch();
    }
  }, [plantsQuery.isSuccess]);

  return {
    deckQuery: deckQuery,
    deckPlantsQuery: plantsQuery,
    deckPlantsImagesQuery: plantsImagesQuery,
  };
}

export default useDeck;

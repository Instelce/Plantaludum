import { useQueries, useQuery } from "@tanstack/react-query";
import {
  loadPlantsIdsList,
  loadPlantsIdsListImages,
  loadDeck,
  loadDeckPlants,
} from "../../services/api/api.js";
import { useEffect } from "react";
import { getObjectKeyValues } from "../../utils/helpers";

function useDeck({ deckId, fetchPlants = false, fetchImages = false }) {
  const [deckQuery, deckPlantsQuery] = useQueries({
    queries: [
      {
        queryKey: ["decks", deckId],
        queryFn: () => loadDeck(deckId),
        staleTime: 30_000,
      },
      {
        queryKey: ["decks-plants", deckId],
        queryFn: () => loadDeckPlants({ deck__id: deckId }),
      },
    ],
  });

  const plantsQuery = useQuery({
    queryKey: ["plants", deckId],
    queryFn: () =>
      loadPlantsIdsList(
        getObjectKeyValues(deckPlantsQuery.data, "plant_id"), // array of plant id
      ),
    onError: (error) => {
      console.log(error);
    },
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

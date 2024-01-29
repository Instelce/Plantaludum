import { useQuery } from "@tanstack/react-query";
import { decks } from "../../services/api";
import { useEffect } from "react";
import { getObjectKeyValues } from "../../utils/helpers";
import { PlantType } from "../../services/api/types/plants";
import { flore } from "../../services/api/flore";
import { PlantImagesType } from "../../services/api/types/images";
import { DeckType } from "../../services/api/types/decks";

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
  const deckQuery = useQuery<DeckType>({
    queryKey: ["decks", deckId],
    queryFn: () => decks.details(parseInt(deckId)),
  });

  const deckPlantsQuery = useQuery<PlantType[]>({
    queryKey: ["decks-plants", deckId],
    queryFn: () => decks.listPlants(parseInt(deckId)),
  });

  const plantsQuery = useQuery<PlantType[], Error>({
    queryKey: ["decks-plants-infos", deckId],
    queryFn: () =>
      flore.plants.getWithIds(
        getObjectKeyValues(deckPlantsQuery.data, "plant_id"), // array of plant id
      ),
    staleTime: Infinity,
    enabled: false,
  });

  const plantsImagesQuery = useQuery<PlantImagesType[], Error>({
    queryKey: ["decks-plants-images", deckId],
    queryFn: () =>
      flore.images.getWithPlantsIds(
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
  }, [deckPlantsQuery.isSuccess, plantsQuery]);

  // fetch plants images
  useEffect(() => {
    if (deckPlantsQuery.isSuccess && fetchImages) {
      plantsImagesQuery.refetch();
    }
  }, [deckPlantsQuery.isSuccess, plantsImagesQuery]);

  return {
    deckQuery: deckQuery || {},
    deckPlantsQuery: plantsQuery || {},
    deckPlantsImagesQuery: plantsImagesQuery || {},
  };
}

export default useDeck;

import { useQuery } from "@tanstack/react-query";
import { decks } from "../../services/api";
import { getObjectKeyValues } from "../../utils/helpers";
import { PlantType } from "../../services/api/types/plants";
import { flore } from "../../services/api/flore";
import { PlantImagesType } from "../../services/api/types/images";
import { DeckType } from "../../services/api/types/decks";

type UseDeckArgs = {
  deckId: number;
  fetchPlants?: boolean;
  fetchImages?: boolean;
  enabled?: boolean;
};

function useDeck({
  deckId,
  fetchPlants = false,
  fetchImages = false,
  enabled = true,
}: UseDeckArgs) {
  const deckQuery = useQuery<DeckType>({
    queryKey: ["decks", deckId.toString()],
    queryFn: () => decks.details(deckId),
    enabled: enabled,
  });

  const deckPlantsQuery = useQuery<PlantType[]>({
    queryKey: ["decks-plants", deckId.toString()],
    queryFn: () => decks.listPlants(deckId),
  });

  const plantsQuery = useQuery<PlantType[], Error>({
    queryKey: ["decks-plants-infos", deckId.toString()],
    queryFn: () =>
      flore.plants.getWithIds(
        getObjectKeyValues(deckPlantsQuery.data as any[], "plant_id").map(Number), // array of plant id
      ),
    staleTime: 20 * 60,
    enabled: fetchPlants && deckPlantsQuery.data != null,
  });

  const plantsImagesQuery = useQuery<PlantImagesType[], Error>({
    queryKey: ["decks-plants-images", deckId.toString()],
    queryFn: () =>
      flore.images.getWithPlantsIds(
        getObjectKeyValues(deckPlantsQuery.data as any[], "plant_id").map(Number),
      ),
    staleTime: 20 * 60,
    enabled: fetchImages && deckPlantsQuery.data != null,
  });

  // fetch quiz plants
  // useEffect(() => {
  //   if (deckPlantsQuery.isSuccess && fetchPlants) {
  //     plantsQuery.refetch();
  //   }
  // }, [deckPlantsQuery.isSuccess]);
  //
  // // fetch plants images
  // useEffect(() => {
  //   if (deckPlantsQuery.isSuccess && fetchImages) {
  //     plantsImagesQuery.refetch();
  //   }
  // }, [deckPlantsQuery.isSuccess]);

  return {
    refetch: deckQuery.refetch,
    deckQuery: deckQuery || {},
    deckPlantsQuery: plantsQuery || {},
    deckPlantsImagesQuery: plantsImagesQuery || {},
  };
}

export default useDeck;

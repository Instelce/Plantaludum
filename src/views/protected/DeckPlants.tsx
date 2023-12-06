import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {FormEvent, useEffect, useState} from "react";
import Button from "../../components/Atoms/Buttons/Button.jsx";
import AutocompleteInput
  from "../../components/Molecules/AutocompleteInput/Autocomplete";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch.js";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {decks} from "../../services/api";
import Navbar from "../../components/Organisms/Navbar/Navbar";
import {ErrorBoundary} from "react-error-boundary";
import PlantCard, {
  PlantCardRemove,
} from "../../components/Molecules/PlantCard/PlantCard";
import {PlantType} from "../../services/api/types/plants";
import {ImageType} from "../../services/api/types/images";
import {CreateDeckPlantFormDataType} from "../../services/api/types/decks";
import {flore} from "../../services/api/flore";
import {useNotification} from "../../context/NotificationsProvider";
import useDeck from "../../hooks/api/useDeck";
import Header from "../../components/Molecules/Header/Header";

function DeckPlants() {
  const privateFetch = usePrivateFetch();

  const location = useLocation();
  const fromLocation = location?.state?.from?.pathname || "/mon-jardin";
  const navigate = useNavigate();
  const { deckId } = useParams();
  const deckDataFromCreate = location.state?.data;
  const notification = useNotification();

  const [plantValue, setPlantValue] = useState<string | null>(null);
  const [plantData, setPlantData] = useState<PlantType | null>(null);
  const [plantIsValid, setPlantIsValid] = useState(false);
  const [removePlantIds, setRemovePlantIds] = useState<number[]>([]);

  const [plants, setPlants] = useState<PlantType[]>([]);

  const { deckQuery, deckPlantsQuery, deckPlantsImagesQuery } = useDeck({
    deckId: deckId as string,
    fetchPlants: true,
    fetchImages: true,
  });
  const deckData = deckDataFromCreate || deckQuery.data;

  const queryClient = useQueryClient();
  const { mutate: mutateCreatePlantQuiz } = useMutation({
    mutationKey: ["decks-plants", deckId],
    mutationFn: (data: CreateDeckPlantFormDataType) =>
      decks.createPlant(privateFetch, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["decks-plants", deckId] });
      queryClient.invalidateQueries({
        queryKey: ["decks-plants-infos", deckId],
      });
      queryClient.invalidateQueries({
        queryKey: ["decks-plants-images", deckId],
      });

      navigate(`/decks/${deckId}`, { replace: true });
    },
  });
  const { mutate: mutateDeletePlantDeck } = useMutation({
    mutationKey: ["decks-plants", deckId],
    mutationFn: (plantId: number) =>
      decks.deletePlant(privateFetch, parseInt(deckId as string), plantId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["decks-plants", deckId] });
      queryClient.invalidateQueries({
        queryKey: ["decks-plants-infos", deckId],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["decks-plants-images", deckId],
        exact: true,
      });
      navigate(`/decks/${deckId}`, { replace: true });
    },
  });

  const plantImagesMutation = useMutation({
    mutationKey: ["decks-plants", deckId],
    mutationFn: (ids: number[]) => flore.images.getWithPlantsIds(ids),
  });

  const handleSubmit = async () => {
    // create plants
    for (const plant of plants) {
      mutateCreatePlantQuiz({
        deck: parseInt(deckId as string, 10),
        plant_id: plant.id,
      });
    }

    // remove plants
    for (const plant_id of removePlantIds) {
      mutateDeletePlantDeck(plant_id);
    }
    notification.success({
      message: deckData
        ? `Plantes de ${deckData.name} mise à jour avec succès`
        : `Plantes de ${deckDataFromCreate.name} créé avec succès`,
    });
  };

  const addPlant = (e: FormEvent) => {
    console.log("submit", e.target);
    e.preventDefault();

    const plantExists =
      plantData &&
      Object.values(plants)
        .map((plant) => plant.id)
        .includes(plantData.id);

    if (plantValue && plantIsValid && !plantExists) {
      console.log("plant", plantData);
      setPlants([...plants, plantData as PlantType]);
    }
  };

  const removePlant = (plant_id: number) => {
    setRemovePlantIds([...removePlantIds, plant_id]);
  };

  const removeFreshPlant = (plant: PlantType) => {
    setPlants(() => [...plants].filter((p) => p !== plant));
  };

  // load plants images
  useEffect(() => {
    console.log(plants);
    console.log(
      "plants",
      [...plants].map((plant) => plant.id),
    );
    if (plants.length > 0) {
      plantImagesMutation.mutate([...plants].map((plant) => plant.id));
    }
  }, [plants]);

  return (
    <>
      <Navbar>
        <div className="left">
          <Link to="/mon-jardin">Mon jardin</Link>
          <Link to="/explorer">Explorer</Link>
        </div>
      </Navbar>

      <Header.Root type="page" center>
        <Header.Title>
          <span className="highlight">Ajoute </span>
          des plantes à {deckData?.name}
        </Header.Title>
      </Header.Root>

      <div className="form-simple-input">
        <form onSubmit={addPlant}>
          <div className="input-button">
            <ErrorBoundary
              fallback={<p>Erreur lors du chargement des données</p>}
            >
              <AutocompleteInput
                id="plant-name"
                label="Nom d'une plante"
                size="large"
                url={`${import.meta.env.VITE_FLORE_API_URL}/api/plants`}
                fieldName="french_name"
                maxSuggestions={5}
                handleValueChange={setPlantValue}
                setValidValue={setPlantIsValid}
                setSelectedValueData={setPlantData}
              />
            </ErrorBoundary>
            <Button
              id="add-plant"
              label="Ajouter"
              type="submit"
              color="primary"
              size="large"
            >
              Ajouter
            </Button>
          </div>
        </form>
      </div>

      <div className="list-container">
        <div className="list-wrapper">
          <ErrorBoundary
            fallback={<p>Erreur lors du chargement des données des plantes.</p>}
          >
            {deckPlantsQuery.isSuccess && deckPlantsImagesQuery.isSuccess && (
              <>
                {deckPlantsQuery?.data
                  .filter((plants) => !removePlantIds.includes(plants.id))
                  .map((plant, index) => (
                    <PlantCardRemove
                      key={index}
                      handleRemove={() => removePlant(plant.id)}
                    >
                      <PlantCard
                        key={index}
                        plant={plant}
                        images={deckPlantsImagesQuery.data
                          .filter((images) => images.id === plant.id)[0]
                          .images?.map((img: ImageType) => img.url)
                          .slice(0, 5)}
                      />
                    </PlantCardRemove>
                  ))}
              </>
            )}
            {plants.map((plant, index) => (
              <PlantCardRemove
                key={index}
                handleRemove={() => removeFreshPlant(plant)}
              >
                <PlantCard
                  key={index}
                  plant={plant}
                  images={plantImagesMutation.data
                    ?.filter((p: PlantType) => p.id === plant.id)?.[0]
                    ?.images?.map((img: ImageType) => img.url)
                    .slice(0, 5)}
                />
              </PlantCardRemove>
            ))}
          </ErrorBoundary>
        </div>
      </div>

      <div className="form-buttons-container">
        <div className="form-buttons-wrapper">
          <Button asChild label="Retour" size="large" color="gray" fill>
            <Link to={`/decks/${deckId}/update`}>Retour</Link>
          </Button>
          {deckPlantsQuery.isSuccess ? (
            <Button
              label="Mettre à jour"
              size="large"
              color="primary"
              disabled={plants.length + deckPlantsQuery.data.length < 4}
              onClick={handleSubmit}
            >
              Mettre à jour
            </Button>
          ) : (
            <Button
              label="Créer les plantes"
              size="large"
              color="primary"
              disabled={plants.length < 4}
              onClick={handleSubmit}
            >
              Créer les plantes
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default DeckPlants;

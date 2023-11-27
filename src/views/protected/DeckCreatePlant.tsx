import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import Button from "../../components/ui/Buttons/Button.jsx";
import AutocompleteInput from "../../components/forms/AutocompleteInput/Autocomplete";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch.js";
import { useMutation } from "@tanstack/react-query";
import { decks, loadPlantsIdsListImages } from "../../services/api";
import Navbar from "../../components/Navbar/Navbar";
import { ErrorBoundary } from "react-error-boundary";
import PlantCard from "../../components/PlantCard/PlantCard";
import {PlantType} from "../../services/api/types/plants";
import {ImageType} from "../../services/api/types/images";
import {CreateDeckPlantFormDataType} from "../../services/api/types/decks";

function DeckCreatePlant() {
  const privateFetch = usePrivateFetch();

  const location = useLocation();
  const fromLocation = location?.state?.from?.pathname || "/mon-jardin";
  const navigate = useNavigate();
  const { deckId } = useParams();
  const quizData = location.state.data;

  const [plantValue, setPlantValue] = useState<string>("");
  const [plantData, setPlantData] = useState<PlantType | null>(null);
  const [plantIsValid, setPlantIsValid] = useState(false);

  const [plants, setPlants] = useState<PlantType[]>([]);

  const { isPending, mutate: mutateCreatePlantQuiz } = useMutation({
    mutationKey: ["decks-plants", deckId],
    mutationFn: (data: CreateDeckPlantFormDataType) => decks.createPlant(privateFetch, data),
    onSuccess: () => {
      navigate(`/decks/${deckId}`, { replace: true });
    },
  });

  const plantImagesMutation = useMutation({
    mutationKey: ["decks-plants", deckId],
    mutationFn: (ids: number[]) => loadPlantsIdsListImages(ids),
  });

  const createDeckPlants = async () => {
    for (const plant of plants) {
      mutateCreatePlantQuiz({
        deck: parseInt(deckId as string, 10),
        plant_id: plant.id,
      });
    }
  };

  const addPlant = (e: FormEvent) => {
    console.log("submit", e.target);
    e.preventDefault();

    const plantExists = plantData && Object.values(plants)
      .map((plant) => plant.id)
      .includes(plantData.id)

    if (
      plantValue &&
      plantIsValid &&
      !plantExists
    ) {
      console.log("plant", plantData);
      setPlants([...plants, plantData as PlantType]);
    }
  };

  const removePlant = (plant: PlantType) => {
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

      <header className="page-header center">
        <h1>
          <span className="highlight">Ajoute </span>
          des plantes à {quizData.name}
        </h1>
      </header>

      <div className="form-page">
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
            {plants.map((plant, index) => (
              <PlantCard
                key={index}
                plant={plant}
                images={plantImagesMutation.data
                  ?.filter((p: PlantType) => p.id === plant.id)?.[0]
                  ?.images?.map((img: ImageType) => img.url)
                  .slice(0, 5)}
              />
            ))}
          </ErrorBoundary>
        </div>
      </div>

      <div className="form-buttons-container">
        <div className="form-buttons-wrapper">
          <Button asChild label="Retour" size="large" color="gray" fill>
            <Link to={fromLocation}>Retour</Link>
          </Button>
          <Button
            label="Continuer"
            size="large"
            color="primary"
            disabled={plants.length < 4}
            onClick={createDeckPlants}
            loading={isPending}
          >
            Continuer
          </Button>
        </div>
      </div>
    </>
  );
}

export default DeckCreatePlant;

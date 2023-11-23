import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Button from "../../components/Buttons/Button.jsx";
import AutocompleteInput from "../../components/forms/AutocompleteInput/index.jsx";
import ButtonLink from "../../components/Buttons/ButtonLink.jsx";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch.js";
import {useMutation} from "@tanstack/react-query";
import {createDeckPlant, loadPlantsIdsListImages} from "../../api/api.js";
import Navbar from "../../components/Navbar/index.jsx";
import {ErrorBoundary} from "react-error-boundary";
import PlantCard from "../../components/PlantCard/index.jsx";


function DeckCreatePlant(props) {
  const privateFetch = usePrivateFetch()

  const location = useLocation()
  const fromLocation = location?.state?.from?.pathname || '/mon-jardin'
  const navigate = useNavigate()
  const {deckId} = useParams()
  const quizData = location.state.data

  const [plantValue, setPlantValue] = useState(null)
  const [plantData, setPlantData] = useState({})
  const [plantIsValid, setPlantIsValid] = useState(false)

  const [plants, setPlants] = useState([])

  const {isPending, mutate: mutateCreatePlantQuiz} = useMutation({
    mutationKey: ['decks-plants', deckId],
    mutationFn: (data) => createDeckPlant(privateFetch, data),
    onSuccess: () => {
      navigate(`/decks/${deckId}`, {replace: true})
    }
  })

  const plantImagesMutation = useMutation({
    mutationKey: ['decks-plants', deckId],
    mutationFn: (ids) => loadPlantsIdsListImages(ids)
  })

  const createDeckPlants = async () => {
    for (const plant of plants) {
      await mutateCreatePlantQuiz({
        deck: deckId,
        plant_id: plant.id,
      })
    }
  }

  const addPlant = (e) => {
    console.log("submit", e.target)
    e.preventDefault()
    if (plantValue && plantIsValid && !Object.values(plants).map(plant => plant.id).includes(plantData.id)) {
      console.log("plant", plantData)
      setPlants(() => [...plants, plantData])
    }
  }

  const removePlant = (plant) => {
    setPlants(() => [...plants].filter(p => p !== plant))
  }

  // load plants images
  useEffect(() => {
    console.log(plants)
    console.log("plants", [...plants].map(plant => plant.id))
    if (plants.length > 0) {
      plantImagesMutation.mutate([...plants].map(plant => plant.id))
    }
  }, [plants]);

  return (
    <>
      <Navbar >
        <div className="left">
          <Link to="/mon-jardin">Mon jardin</Link>
          <Link to="/explorer">Explorer</Link>
        </div>
        <div className="right">
          <ButtonLink
            label="Nouveau deck"
            color="gray"
          />
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
            <ErrorBoundary fallback={<p>Erreur lors du chargement des données</p>}>
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
            />
          </div>
        </form>
      </div>

      <div className="list-container">
        <div className="list-wrapper">
          <ErrorBoundary fallback={<p>Erreur lors du chargement des données des plantes.</p>}>
            {plants.map((plant, index) => (
              <PlantCard key={index} index={index} plant={plant} images={
                plantImagesMutation.data?.filter(p => p.id === plant.id)?.[0]?.images?.map(img => img.url).slice(0, 5)
              } />
            ))}
          </ErrorBoundary>
        </div>
      </div>

      <div className="form-buttons-container">
        <div className="form-buttons-wrapper">
          <ButtonLink
            to={fromLocation}
            label="Retour"
            size="large"
            color="gray"
            variant="soft"
            fill
          />
          <Button
            label="Continuer"
            size="large"
            color="primary"
            // disabled={plants.length < 3}
            onClick={createDeckPlants}
            loading={isPending}
            />
        </div>
      </div>
    </>
  );
}


export default DeckCreatePlant;
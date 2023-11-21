import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Button from "../../components/Buttons/Button.jsx";
import AutocompleteInput from "../../components/forms/AutocompleteInput/index.jsx";
import ListItem from "../../components/ListItem/index.jsx";
import ButtonLink from "../../components/Buttons/ButtonLink.jsx";
import {useFetch} from "../../hooks/useFetch.js";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch.js";
import {useMutation} from "@tanstack/react-query";
import {createDeckPlant} from "../../api/api.js";
import {navigate} from "@storybook/addon-links";
import Navbar from "../../components/Navbar/index.jsx";
import {ErrorBoundary} from "react-error-boundary";


function DeckCreatePlant(props) {
  const privateFetch = usePrivateFetch()

  const location = useLocation()
  const fromLocation = location?.state?.from?.pathname || '/menu'
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

  const createDeckPlants = async () => {
    for (const plant of plants) {
      await mutateCreatePlantQuiz({
        deck: deckId,
        plant_id: plant.id,
      })
    }
  }

  const addPlant = (e) => {
    e.preventDefault()
    if (plantValue && plantIsValid && !Object.values(plants).includes(plantData.french_name)) {
      console.log("plant", plantData)
      setPlants(() => [...plants, { id: plantData.id, name: plantValue }])
    }
    console.log(e.target.value)
  }

  const removePlant = (plant) => {
    setPlants(() => [...plants].filter(p => p !== plant))
  }

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

      <div className="form-page">
        <form onSubmit={addPlant}>
          <div className="input-button">
            <ErrorBoundary fallback={<p>Erreur de chargement des données</p>}>
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
        {plants.map((plant, index) => (
          // <PlantCard />
          <ListItem key={plant.id} index={index} title={plant.name} removeFunc={() => removePlant(plant)} />
        ))}
      </div>

      <div className="form-buttons">
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
    </>
  );
}


export default DeckCreatePlant;
import {useLocation, useNavigate, useParams} from "react-router-dom";
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
    <div className="container center">
      <form className="form-page" onSubmit={addPlant}>
        <div className="form-header">
          <h1>Creation des plants du quiz {quizData.name}</h1>
        </div>
        <div className="input-button">
          <AutocompleteInput
            id="plant-name"
            label="Nom d'une plante"
            size="big"
            url={`${import.meta.env.VITE_FLORE_API_URL}/api/plants`}
            fieldName="french_name"
            maxSuggestions={5}
            handleValueChange={setPlantValue}
            setValidValue={setPlantIsValid}
            setSelectedValueData={setPlantData}
          />
          <Button
            id="add-plant"
            label="Ajouter"
            type="submit"
            color="primary"
            size="lg"
          />
        </div>
      </form>
      
      <div className="list-container">
        {plants.map((plant, index) => (
          <ListItem key={plant.id} index={index} title={plant.name} removeFunc={() => removePlant(plant)} />
        ))}
      </div>

      <div className="two-buttons">
        <ButtonLink
          to={fromLocation}
          label="Retour"
          size="big"
          color="secondary"
          variant="soft"
          fill
        />
        <Button
          label="Continuer"
          size="big"
          color="primary"
          // disabled={plants.length < 3}
          onClick={createDeckPlants}
          loading={isPending}
          />
      </div>
    </div>
  );
}


export default DeckCreatePlant;
import usePrivateFetch from "../../hooks/auth/usePrivateFetch.js";
import useFormFilled from "../../hooks/useFormFilled.js";
import Input from "../../components/forms/Input/index.jsx";
import Textarea from "../../components/forms/Textarea/index.jsx";
import Dropdown from "../../components/forms/Dropdown/index.jsx";
import {useEffect, useState} from "react";
import Checkbox from "../../components/forms/Checkbox/index.jsx";
import AutocompleteInput
  from "../../components/forms/AutocompleteInput/index.jsx";
import Option from "../../components/forms/Option/index.jsx";
import Selector from "../../components/forms/Selector/index.jsx";
import {floreFetch} from "../../api/axios.js";
import {deleteDublicates} from "../../utils.js";


function CreateQuiz(props) {
  const privateFetch = usePrivateFetch()
  const [difficultyValue, setDifficultyValue] = useState(0)
  const {formRef, handleFormChange, isFilled} = useFormFilled()
  const [plantValue, setPlantValue] = useState(null)
  const [plantIsValid, setPlantIsValid] = useState(false)
  const [plantImages, setPlantImages] = useState(null)
  const [imageValue, setImageValue] = useState(null)

  useEffect(() => {
    if (plantIsValid) {
      floreFetch.get(`/api/images?plant__french_name=${plantValue}`)
        .then(r => {
         setPlantImages(prev => deleteDublicates(r.data.results.map(data => data.url.replace('L', 'CRS'))))
        })
    }
  }, [plantIsValid]);

  const handleFormSubmit = (e) => {
    const formData = new FormData(e.target);

  }

  return (
    <div className="container center">
      <form className="form-page" onSubmit={handleFormSubmit}>
        <div className="form-header">
          <h1>Creation d'un quiz</h1>
        </div>
        <Input
          id="name"
          label="Nom"
          type="text"
          size="big"
        />
        <Textarea
          id="description"
          label="Description"
          maxLenght={100}
          mb="1rem"
        />
        <Dropdown
          label="Difficulté"
          size="big"
          setValue={setDifficultyValue}
          mb="1rem"
        >
          <Option>1</Option>
          <Option>2</Option>
          <Option>3</Option>
        </Dropdown>
        <p style={{marginBottom: '.6rem'}}>Cherche le nom d’une plante, puis choisie l’image de la plante qui
          te semble la mieux. <br/> Choisie la bien car c'est elle qui servira d'image de couverture au quiz.</p>
        {imageValue === null && <AutocompleteInput
          label="Nom d'une plante"
          size="big"
          url={`http://127.0.0.1:8001/api/plants`}
          fieldName="french_name"
          maxSuggestions={5}
          handleValueChange={setPlantValue}
          setValidValue={setPlantIsValid}
        />}
        {plantIsValid && <div>
          {plantImages !== null ? <Selector
            choices={plantImages}
            choiceType="img"
            setValue={setImageValue}
          /> :
            <p>Chargement des images</p>
          }
        </div>}
        <Checkbox
          label="Privé"
          style={{marginBottom: '1rem'}}
        />
      </form>
    </div>
  );
}

export default CreateQuiz;
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
import ButtonLink from "../../components/Buttons/ButtonLink.jsx";
import {useLocation} from "react-router-dom";
import Button from "../../components/Buttons/Button.jsx";
import useAuth from "../../hooks/auth/useAuth.js";


function CreateQuiz(props) {
  const privateFetch = usePrivateFetch()
  const location = useLocation()
  const fromLocation = location?.state?.from?.pathname || '/menu'
  const {user} = useAuth()

  const {formRef, handleFormChange, isFilled} = useFormFilled()

  const [plantValue, setPlantValue] = useState(null)
  const [plantIsValid, setPlantIsValid] = useState(false)
  const [plantImages, setPlantImages] = useState(null)
  const [imageValue, setImageValue] = useState(null)

  useEffect(() => {
    // get all image urls for autocomplete input
    if (plantIsValid) {
      floreFetch.get(`/api/images?plant__french_name=${plantValue}`)
        .then(r => {
         setPlantImages(prev => deleteDublicates(r.data.results.map(data => data.url.replace('L', 'CRS'))))
        })
    }
  }, [plantIsValid]);

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target);

    console.log(user)

    privateFetch.post('/api/quizzes', {
      name: formData.get('name'),
      description: formData.get('description'),
      difficulty: formData.get('difficulty'),
      preview_image_url: formData.get('preview-image-url'),
      private: formData.get('private') ? formData.get('private') : false,
      user: localStorage.getItem("USER-ID"),
    }).then(r => {

    }).catch(error => {
      console.log(error.response.data)
    })
  }

   return (
    <div className="container center">
      <form ref={formRef} className="form-page" onSubmit={handleFormSubmit} onChange={(e) => handleFormChange(e.target)}>
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
          maxLenght={500}
          mb="1rem"
        />
        <Dropdown
          inputId="difficulty"
          label="Difficulté"
          size="big"
          mb="1rem"
        >
          <Option>1</Option>
          <Option>2</Option>
          <Option>3</Option>
        </Dropdown>
        {imageValue === null && <>
          <p style={{marginBottom: '.6rem'}}>Cherche le nom d’une plante, puis choisie l’image de la plante qui
            te semble la mieux. <br/> Choisie la bien car c'est elle qui servira d'image de couverture au quiz.</p>
          <AutocompleteInput
            label="Nom d'une plante"
            size="big"
            url={`${import.meta.env.VITE_FLORE_API_URL}/api/plants`}
            fieldName="french_name"
            maxSuggestions={5}
            handleValueChange={setPlantValue}
            setValidValue={setPlantIsValid}
          />
        </>
        }
        {plantIsValid && <div>
          {plantImages !== null ? <Selector
            inputId="preview-image-url"
            choices={plantImages}
            choiceType="img"
            setValue={setImageValue}
          /> :
            <p>Chargement des images</p>
          }
        </div>}
        <Checkbox
          id="private"
          label="Privé"
          defaultValue="true"
          style={{marginBottom: '1rem'}}
        />
        <div className="form-buttons">
          <ButtonLink to={fromLocation} label="Retour" size="big" color="secondary" variant="soft" fill={true} />
          <Button label="Continuer" size="big" type="submit" color="primary" disabled={!isFilled} />
        </div>
      </form>
    </div>
  );
}

export default CreateQuiz;
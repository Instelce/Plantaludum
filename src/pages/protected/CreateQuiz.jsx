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


function CreateQuiz(props) {
  const privateFetch = usePrivateFetch()
  const [difficultyValue, setDifficultyValue] = useState(0)
  const {formRef, handleFormChange, isFilled} = useFormFilled()

  useEffect(() => {
    console.log(difficultyValue)
  }, [difficultyValue]);

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
          te semble la mieux.</p>
        <AutocompleteInput
          label="Image de couverture"
          size="big"
          url={`http://127.0.0.1:8001/api/plants`}
          fieldName="french_name"
          maxSuggestions={5}
        />
        <Checkbox
          label="Privé"
          style={{marginBottom: '1rem'}}
        />
      </form>
    </div>
  );
}

export default CreateQuiz;
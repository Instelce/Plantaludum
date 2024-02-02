import usePrivateFetch from "../../hooks/auth/usePrivateFetch.js";
import useFormFilled from "../../hooks/useFormFilled.js";
import Input from "../../components/Atoms/Input/Input";
import Textarea from "../../components/Atoms/Textarea/Textarea";
import Dropdown from "../../components/Molecules/Dropdown/Dropdown";
import { FormEvent, useEffect, useState } from "react";
import Checkbox from "../../components/Atoms/Checkbox/Checkbox";
import AutocompleteInput from "../../components/Molecules/AutocompleteInput/Autocomplete";
import Option from "../../components/Atoms/Option/Option";
import Selector from "../../components/Organisms/Selector/Selector";
import { deleteDublicates } from "../../utils/helpers";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Atoms/Buttons/Button.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { decks, PaginationResponseType } from "../../services/api";
import Navbar from "../../components/Organisms/Navbar/Navbar";
import { ErrorBoundary } from "react-error-boundary";
import {
  CreateDeckFormDataType,
  DeckType,
} from "../../services/api/types/decks";
import { ImageType } from "../../services/api/types/images";
import useUser from "../../hooks/auth/useUser";
import { flore } from "../../services/api/flore";
import Header from "../../components/Molecules/Header/Header";
import PlantImageSelector from "../../components/Organisms/PlantImageSelector/PlantImageSelector";

function DeckCreate() {
  const user = useUser();
  const privateFetch = usePrivateFetch();
  const location = useLocation();
  const fromLocation = location?.state?.from?.pathname || "/mon-jardin";
  const navigate = useNavigate();

  const { formRef, handleFormChange, isFilled } = useFormFilled();

  const [plantValue, setPlantValue] = useState<string | null>(null);
  const [plantIsValid, setPlantIsValid] = useState(false);
  const [plantImages, setPlantImages] = useState(null);
  const [imageValue, setImageValue] = useState<string | null>(null);

  const {
    isSuccess,
    data: deckData,
    mutate: mutateCreateDeck,
  } = useMutation({
    mutationKey: [],
    mutationFn: (data: CreateDeckFormDataType) =>
      decks.create(privateFetch, data),
    onSuccess: (data: DeckType) => {
      navigate(`/decks/${data?.id}/plants`, {
        state: {
          data: data,
          from: { pathname: location.pathname },
        },
      });
    },
  });

  // Navigate to create deck plants form if the deck is successfully created
  useEffect(() => {
    if (isSuccess) {
      console.log(deckData);
    }
  }, [deckData, isSuccess]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    console.log(user);

    mutateCreateDeck({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      difficulty: formData.get("difficulty") as string,
      preview_image_url: formData.get("preview-image-url") as string,
      private: !!formData.get("private"),
      user: user?.id as number,
    });
  };

  return (
    <>
      <Navbar.Root>
        <Navbar.Left>
          <Link to="/mon-jardin">Mon jardin</Link>
          <Link to="/explorer">Explorer</Link>
        </Navbar.Left>
      </Navbar.Root>

      <Header.Root type="page" center>
        <Header.Title>
          <span className="highlight">Créer</span> ton deck
        </Header.Title>
      </Header.Root>

      <div className="form-page">
        <form
          ref={formRef}
          onSubmit={handleFormSubmit}
          onChange={handleFormChange}
        >
          <Input id="name" label="Nom" type="text" />
          <Textarea id="description" label="Description" maxlength={500} />
          <Dropdown inputId="difficulty" label="Difficulté" size="large">
            <Option>1</Option>
            <Option>2</Option>
            <Option>3</Option>
          </Dropdown>

          <PlantImageSelector handleImageValueChange={setImageValue} />

          <Checkbox
            id="private"
            label="Privé"
            takeValue="true"
            data-not-count
          />
          <div className="form-buttons">
            <Button asChild label="Retour" size="large" color="gray" fill>
              <Link
                to={fromLocation}
                state={{ from: { pathname: location.pathname } }}
              >
                Retour
              </Link>
            </Button>
            <Button
              label="Continuer"
              size="large"
              type="submit"
              color="primary"
              disabled={!isFilled}
            >
              Continuer
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default DeckCreate;

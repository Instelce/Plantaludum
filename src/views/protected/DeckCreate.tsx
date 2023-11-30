import usePrivateFetch from "../../hooks/auth/usePrivateFetch.js";
import useFormFilled from "../../hooks/useFormFilled.js";
import Input from "../../components/forms/Input/Input";
import Textarea from "../../components/forms/Textarea/Textarea";
import Dropdown from "../../components/forms/Dropdown/Dropdown";
import { FormEvent, useEffect, useState } from "react";
import Checkbox from "../../components/forms/Checkbox/Checkbox";
import AutocompleteInput from "../../components/forms/AutocompleteInput/Autocomplete";
import Option from "../../components/forms/Option/Option";
import Selector from "../../components/forms/Selector/index.jsx";
import { deleteDublicates } from "../../utils/helpers";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import Button from "../../components/ui/Buttons/Button.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { decks, loadImages } from "../../services/api";
import Navbar from "../../components/Navbar/Navbar";
import { ErrorBoundary } from "react-error-boundary";
import { useAuth } from "../../context/AuthProvider";
import { CreateDeckFormDataType } from "../../services/api/types/decks";
import { ImageType } from "../../services/api/types/images";
import useUser from "../../hooks/auth/useUser";
import useDeck from "../../hooks/api/useDeck";

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
    mutationKey: ["decks"],
    mutationFn: (data: CreateDeckFormDataType) =>
      decks.create(privateFetch, data),
  });

  const {
    isLoading: imagesLoading,
    data: imagesData,
    error,
    refetch: fetchImages,
  } = useQuery({
    queryKey: ["images"],
    queryFn: () => loadImages({ plant__french_name: plantValue }),
    staleTime: Infinity,
    enabled: false,
  });
  const plantImagesData = imagesData || null;


  // get all image urls for autocomplete input
  useEffect(() => {
    if (plantIsValid) {
      fetchImages();
    }
  }, [plantIsValid]);

  // set plant images to an array of images
  useEffect(() => {
    if (plantImagesData) {
      setPlantImages(() =>
        deleteDublicates(
          plantImagesData.results.map((data: ImageType) =>
            data.url.replace("L", "CRS"),
          ),
        ),
      );
    }
  }, [plantImagesData]);

  // Navigate to create deck plants form if the deck is successfully created
  useEffect(() => {
    if (isSuccess) {
      console.log(deckData);
      navigate(`/decks/${deckData.id}/plants/create`, {
        state: {
          data: deckData,
          from: { pathname: location.pathname },
        },
      });
    }
  }, [isSuccess]);

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
      user: user.id,
    });
  };

  useEffect(() => {
    console.log("err", error);
  }, [error]);

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
          <span className="highlight">Créer</span> ton deck
        </h1>
      </header>

      <div className="form-page">
        <form
          ref={formRef}
          onSubmit={handleFormSubmit}
          onChange={handleFormChange}
        >
          <Input id="name" label="Nom" type="text" size="large" />
          <Textarea
            id="description"
            label="Description"
            maxLenght={500}
            mb="1rem"
          />
          <Dropdown
            inputId="difficulty"
            label="Difficulté"
            size="large"
            mb="1rem"
          >
            <Option>1</Option>
            <Option>2</Option>
            <Option>3</Option>
          </Dropdown>
          <ErrorBoundary
            fallback={<p>Erreur lors de l'obtention des données.</p>}
          >
            {imageValue === null && (
              <>
                <AutocompleteInput
                  label="Nom d'une plante"
                  size="large"
                  url={`${import.meta.env.VITE_FLORE_API_URL}/api/plants`}
                  fieldName="french_name"
                  maxSuggestions={5}
                  handleValueChange={setPlantValue}
                  setValidValue={setPlantIsValid}
                  usageInfoText="Cherche le nom d’une plante, puis choisie l’image
                de la plante qui te semble la mieux. Choisie la bien car c'est
                elle qui servira d'image de couverture au decks."
                />
              </>
            )}
          </ErrorBoundary>
          {!imagesLoading && plantValue && (
            <div>
              {plantImages !== null ? (
                <Selector
                  inputId="preview-image-url"
                  choices={plantImages}
                  choiceType="img"
                  setValue={setImageValue}
                />
              ) : (
                <p>Chargement des images</p>
              )}
            </div>
          )}
          <Checkbox
            id="private"
            label="Privé"
            takeValue="true"
            style={{ marginBottom: "1rem" }}
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
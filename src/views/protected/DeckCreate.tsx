import usePrivateFetch from "../../hooks/auth/usePrivateFetch.js";
import useFormFilled from "../../hooks/useFormFilled.js";
import Input from "../../components/Atoms/Input/Input";
import Textarea from "../../components/Atoms/Textarea/Textarea";
import Dropdown from "../../components/Molecules/Dropdown/Dropdown";
import {FormEvent, useEffect, useState} from "react";
import Checkbox from "../../components/Atoms/Checkbox/Checkbox";
import AutocompleteInput
  from "../../components/Molecules/AutocompleteInput/Autocomplete";
import Option from "../../components/Atoms/Option/Option";
import Selector from "../../components/Organisms/Selector/index.jsx";
import {deleteDublicates} from "../../utils/helpers";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Button from "../../components/Atoms/Buttons/Button.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {decks, PaginationResponseType} from "../../services/api";
import Navbar from "../../components/Organisms/Navbar/Navbar";
import {ErrorBoundary} from "react-error-boundary";
import {CreateDeckFormDataType} from "../../services/api/types/decks";
import {ImageType} from "../../services/api/types/images";
import useUser from "../../hooks/auth/useUser";
import {flore} from "../../services/api/flore";

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
    onSuccess: (data: CreateDeckFormDataType) => {
      navigate(`/decks/${data?.id}/plants`, {
        state: {
          data: data,
          from: { pathname: location.pathname },
        },
      });
    }
  });

  const {
    isLoading: imagesLoading,
    data: imagesData,
    error,
    refetch: fetchImages,
  } = useQuery<PaginationResponseType<ImageType>, Error>({
    queryKey: ["images"],
    queryFn: () => flore.images.list({ plant__french_name: plantValue }),
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
      user: user?.id as number,
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
          <Input id="name" label="Nom" type="text" />
          <Textarea id="description" label="Description" maxlength={500} />
          <Dropdown inputId="difficulty" label="Difficulté" size="large">
            <Option>1</Option>
            <Option>2</Option>
            <Option>3</Option>
          </Dropdown>
          <ErrorBoundary
            fallback={<p>Erreur lors de l&apos;obtention des données.</p>}
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
                  data-not-count
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

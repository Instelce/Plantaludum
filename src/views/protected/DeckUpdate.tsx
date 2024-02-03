import React, { FormEvent, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Dropdown from "../../components/Molecules/Dropdown/Dropdown";
import AutocompleteInput from "../../components/Molecules/AutocompleteInput/Autocomplete";
import Checkbox from "../../components/Atoms/Checkbox/Checkbox";
import Button from "../../components/Atoms/Buttons/Button";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Selector from "../../components/Organisms/Selector/Selector";
import useUser from "../../hooks/auth/useUser";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UpdateDeckFormDataType } from "../../services/api/types/decks";
import { decks, PaginationResponseType } from "../../services/api";
import useFormFilled from "../../hooks/useFormFilled";
import { deleteDublicates } from "../../utils/helpers";
import { ImageType } from "../../services/api/types/images";
import Navbar from "../../components/Organisms/Navbar/Navbar";
import Input from "../../components/Atoms/Input/Input";
import Textarea from "../../components/Atoms/Textarea/Textarea";
import Option from "../../components/Atoms/Option/Option";
import useDeck from "../../hooks/api/useDeck";
import { useNotification } from "../../context/NotificationsProvider";
import { flore } from "../../services/api/flore";
import Header from "../../components/Molecules/Header/Header";
import PlantImageSelector from "../../components/Organisms/PlantImageSelector/PlantImageSelector";

function DeckUpdate() {
  const user = useUser();
  const privateFetch = usePrivateFetch();
  const location = useLocation();
  const fromLocation = location?.state?.from?.pathname || "/mon-jardin";
  const navigate = useNavigate();
  const notification = useNotification();

  const { deckId } = useParams();
  const { deckQuery } = useDeck({ deckId: deckId as string });

  const { formRef, handleFormChange, isFilled } = useFormFilled();
  const [plantValue, setPlantValue] = useState<string | null>(null);
  const [plantIsValid, setPlantIsValid] = useState(false);
  const [plantImages, setPlantImages] = useState(null);
  const [imageValue, setImageValue] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const {
    isSuccess,
    data: deckData,
    mutate: mutateCreateDeck,
  } = useMutation({
    mutationKey: ["decks"],
    mutationFn: (data: UpdateDeckFormDataType) =>
      decks.update(privateFetch, deckId ? deckId : "", data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      queryClient.invalidateQueries({ queryKey: ["decks", deckId] });
      notification.success({ message: `${data.name} mit à jour avec succès` });
      navigate(`/decks/${deckId}`);
    },
  });

  useEffect(() => {
    if (deckQuery.isSuccess) {
      setImageValue(() => deckQuery.data.preview_image_url);
    }
  }, [deckQuery.data.preview_image_url, deckQuery.isSuccess]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    console.log(user);
    console.log(formData.get("preview-image-url"));
    console.log(deckData);

    mutateCreateDeck({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      difficulty: parseInt(formData.get("difficulty") as string) as number,
      preview_image_url: formData.get("preview-image-url")
        ? formData.get("preview-image-url")?.toString()
        : (deckQuery.data?.preview_image_url as string),
      private: !!formData.get("private"),
      user: user?.id,
    });
  };

  return (
    <>
      <Header.Root type="page" center>
        <Header.Title>
          <span className="highlight">Mise à jour</span> de &quot;
          {deckQuery.data?.name}&quot;
        </Header.Title>
      </Header.Root>

      <div className="form-page">
        <form
          ref={formRef}
          onSubmit={handleFormSubmit}
          onChange={handleFormChange}
        >
          <Input
            id="name"
            label="Nom"
            type="text"
            defaultValue={deckQuery.data?.name}
          />

          <Textarea
            id="description"
            label="Description"
            maxlength={500}
            defaultValue={deckQuery.data?.description}
          />

          <Dropdown
            inputId="difficulty"
            label="Difficulté"
            size="large"
            defaultValue={deckQuery.data?.difficulty.toString()}
          >
            <Option>1</Option>
            <Option>2</Option>
            <Option>3</Option>
          </Dropdown>

          <PlantImageSelector
            handleImageValueChange={setImageValue}
            defaultValue={deckQuery.data?.preview_image_url || ""}
          />

          <Checkbox
            id="private"
            label="Privé"
            takeValue="true"
            defaultChecked={deckQuery.data?.private}
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
              Appliquer les modifications
            </Button>
          </div>
          <Button asChild fill color="gray">
            <Link to={`/decks/${deckId}/plants`}> Modifier les plantes</Link>
          </Button>
        </form>
      </div>
    </>
  );
}

export default DeckUpdate;

import React, {FormEvent, useState} from "react";
import {Link, useLocation, useParams} from "react-router-dom";
import Header from "../../components/Molecules/Header/Header";
import {useMutation, useQuery} from "@tanstack/react-query";
import {flore} from "../../services/api/flore";
import identifications from "../../services/api/plantaludum/identifications";
import {
  CreateIdentificationAnswerType,
  IdentificationType
} from "../../services/api/types/identifications";
import SingleImage
  from "../../components/Molecules/SingleImage/SingleImage/SingleImage";
import {ImageType} from "../../services/api/types/images";
import AutocompleteInput
  from "../../components/Molecules/AutocompleteInput/Autocomplete";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch";
import Button from "../../components/Atoms/Buttons/Button";
import {CheckCircle, ChevronLeft} from "react-feather";
import {useNotification} from "../../context/NotificationsProvider";
import {PlantType} from "../../services/api/types/plants";

function IdentificationResponse() {
  const {identificationId} = useParams();
  const privateFetch = usePrivateFetch();
  const notifications = useNotification()
  const location = useLocation();

  const [isValid, setIsValid] = useState(false)
  const [plantData, setPlantData] = useState<PlantType>({})
  const [isSubmited, setIsSubmited] = useState(false)

  // get data passed
  const identificationData = location.state?.data as {
    identification: IdentificationType;
    image: ImageType;
  };

  const {mutate: updateIdentificationAnswer} = useMutation({
    mutationKey: ["add-identification-answer", identificationId],
    mutationFn: (data: CreateIdentificationAnswerType) => identifications.update(privateFetch, identificationId as string, data),
    onSuccess: () => {
      setIsSubmited(true)
    }
  })

  function submitHandler(e: FormEvent) {
    e.preventDefault()

    if (isValid) {
      updateIdentificationAnswer({
        answer: plantData.id,
      });
    } else {
      notifications.warning({
        message: "Nom de plante invalide"
      })
    }
  }

  return (
    <div>
      <Header.Root type="section">
        <Header.Title className="sb center gg-2">
          <Button asChild onlyIcon size="small" color="gray" bounce={false}>
            <Link to="/identifications"><ChevronLeft/></Link>
          </Button>
          Mmh, quel est cette plante ?
        </Header.Title>
      </Header.Root>
      <div className="content-container flex gg-2">

        {identificationData && (
          <div>
            <SingleImage.Root
              size={30}
              image={identificationData.image}
            ></SingleImage.Root>
          </div>
        )}

        {!isSubmited && <div className="fill-horizontal">
          <form onSubmit={submitHandler}>
            <div className="input-button">
              <AutocompleteInput
                id="plant_id"
                label="Nom de la plante"
                size="large"
                url={`${import.meta.env.VITE_FLORE_API_URL}/api/plants`}
                fieldName="french_name"
                setValidValue={setIsValid}
                setSelectedValueData={setPlantData}
              />

              <Button fill>
                Soumettre
              </Button>
            </div>
          </form>

          <p className="mt-1">
            Vous avez des difficultés à reconnaitre cette plante ? <br/>
            Pourquoi ne pas vous entrainer avec ce <Link
            to={`/decks/${identificationData.identification?.user_played_deck.deck.id}`}
            className="link">deck</Link> ?
          </p>
        </div>}

        {isSubmited && <div>
          <CheckCircle color="rgb(var(--color-primary-light))" />
          <p>Votre réponse à été pris en compte.</p>
        </div>}
      </div>
    </div>
  );
}

export default IdentificationResponse;

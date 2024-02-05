import React from "react";
import { useLocation, useParams } from "react-router-dom";
import Header from "../../components/Molecules/Header/Header";
import { useMutation, useQuery } from "@tanstack/react-query";
import { flore } from "../../services/api/flore";
import identifications from "../../services/api/plantaludum/identifications";
import { IdentificationType } from "../../services/api/types/identifications";
import SingleImage from "../../components/Molecules/SingleImage/SingleImage/SingleImage";
import { ImageType } from "../../services/api/types/images";
import AutocompleteInput from "../../components/Molecules/AutocompleteInput/Autocomplete";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch";

function IdentificationResponse() {
  const { identificationId } = useParams();
  const privateFetch = usePrivateFetch();

  const location = useLocation();
  const identificationData = location.state?.data as {
    identification: IdentificationType;
    image: ImageType;
  };

  // const identificationQuery = useQuery({
  //   queryKey: ["identification", identificationId],
  //   queryFn: () => identifications.get(identificationId),
  // })

  return (
    <div className="content-container grid gc-2 gg-2">
      {/*<Header.Root type="section">*/}
      {/*  <Header.Title>Identification</Header.Title>*/}
      {/*</Header.Root>*/}

      {identificationData && (
        <div className="center">
          <SingleImage.Root
            size={30}
            image={identificationData.image}
          ></SingleImage.Root>
        </div>
      )}

      <AutocompleteInput
        label="Nom de la plante"
        size="large"
        url={`${import.meta.env.VITE_FLORE_API_URL}/api/plants`}
        fieldName="french_name"
      />
    </div>
  );
}

export default IdentificationResponse;

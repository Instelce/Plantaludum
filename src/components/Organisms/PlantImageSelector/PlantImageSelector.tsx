import "./PlantImageSelector.scss";
import { ErrorBoundary } from "react-error-boundary";
import AutocompleteInput from "../../Molecules/AutocompleteInput/Autocomplete";
import Selector from "../Selector/Selector";
import { useQuery } from "@tanstack/react-query";
import { PaginationResponseType } from "../../../services/api";
import { ImageType } from "../../../services/api/types/images";
import { flore } from "../../../services/api/flore";
import { useEffect, useState } from "react";
import { deleteDublicates } from "../../../utils/helpers";

type PlantImageSelectorProps = {
  setPlantImage: (value: string) => void;
  defaultValue: string;
};

function PlantImageSelector({
  defaultValue,
  setPlantImage,
}: PlantImageSelectorProps) {
  const [plantValue, setPlantValue] = useState<string | null>(null);
  const [plantIsValid, setPlantIsValid] = useState(false);
  const [plantImages, setPlantImages] = useState(null);
  const [imageValue, setImageValue] = useState<string | null>(null);

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

  // set image value to null if default value doesn't exist
  useEffect(() => {
    if (defaultValue === "") {
      setImageValue(null);
    }
  }, [defaultValue]);

  // get all image urls for autocomplete input
  useEffect(() => {
    if (plantIsValid) {
      fetchImages();
    }
  }, [fetchImages, plantIsValid]);

  // set plant images to an array of images
  useEffect(() => {
    if (plantImagesData) {
      setPlantImages(() =>
        deleteDublicates(
          plantImagesData.results.map(
            (data: ImageType) => data.url.replace("L", "CRS"), // change format of image
          ),
        ),
      );
    }
  }, [plantImagesData]);

  return (
    <>
      <ErrorBoundary fallback={<p>Erreur lors de l'obtention des images.</p>}>
        {!imageValue && (
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
      {!imagesLoading && (
        <div>
          {/*{plantImages !== null ? (*/}
          <Selector
            inputId="preview-image-url"
            choices={plantImages}
            choiceType="img"
            defaultValue={defaultValue}
            setValue={(value) => {
              setImageValue(value);
              setPlantImage(value);
            }}
          />
          {/*) : (*/}
          {/*  <p>Chargement des images</p>*/}
          {/*)}*/}
        </div>
      )}
    </>
  );
}

export default PlantImageSelector;

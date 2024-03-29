import "./PlantImageSelector.scss";
import { ErrorBoundary } from "react-error-boundary";
import AutocompleteInput from "../../Molecules/AutocompleteInput/Autocomplete";
import Selector from "../Selector/Selector";
import { useQuery } from "@tanstack/react-query";
import { ImageType } from "../../../services/api/types/images";
import { flore } from "../../../services/api/flore";
import { useEffect, useState } from "react";
import { deleteDublicates, getAnotherFormat } from "../../../utils/helpers";
import { PaginationResponseType } from "../../../services/api/types/pagination";

type PlantImageSelectorProps = {
  // eslint-disable-next-line no-unused-vars
  handleImageValueChange: (value: string) => void;
  defaultValue?: string;
};

function PlantImageSelector({
  defaultValue,
  handleImageValueChange,
}: PlantImageSelectorProps) {
  const [plantValue, setPlantValue] = useState<string | null>(null);
  const [plantIsValid, setPlantIsValid] = useState(false);
  const [plantImages, setPlantImages] = useState<string[] | null>(null);
  const [imageValue, setImageValue] = useState<string | null>(null);
  const [isFirst, setIsFirst] = useState(true);

  const {
    isLoading: imagesLoading,
    data: imagesData,
    refetch: fetchImages,
  } = useQuery<PaginationResponseType<ImageType>, Error>({
    queryKey: ["selector-plants-images"],
    queryFn: () => flore.images.list({ plant__french_name: plantValue }),
    staleTime: Infinity,
    enabled: false,
  });
  let plantImagesData = imagesData || null;

  // set image value to null if default value doesn't exist
  useEffect(() => {
    if (defaultValue === "" && defaultValue === null) {
      setImageValue(null);
    } else  {
      setImageValue(defaultValue as string);
    }
  }, [defaultValue]);

  // get all image urls for autocomplete input
  useEffect(() => {
    if (plantIsValid) {
      fetchImages();
      setIsFirst(false);
    }
  }, [fetchImages, plantIsValid]);

  // set plant images to an array of images
  useEffect(() => {
    if (plantImagesData && !isFirst) {
      setPlantImages(() =>
        deleteDublicates(
          plantImagesData?.results.map(
            (data: ImageType) => getAnotherFormat(data.url, "CRS"), // change format of image
          ) as any[]
        ),
      );
    }
  }, [plantImagesData]);

  console.log(plantValue, "-", plantImages)

  return (
    <>
      <ErrorBoundary
        fallback={<p>Erreur lors de l&apos;obtention des données.</p>}
      >
        {!imageValue && (
          <>
            <AutocompleteInput
              label="Nom d'une plante (autocomplétion)"
              size="large"
              url={`${import.meta.env.VITE_FLORE_API_URL}/api/plants`}
              fieldName="french_name"
              maxSuggestions={10}
              handleValueChange={setPlantValue}
              setValidValue={setPlantIsValid}
              usageInfoText="Cherche le nom d’une plante, puis choisis l’image
                de la plante qui te semble la mieux. Choisis la bien car c'est
                elle qui servira d'image de couverture aux decks."
              hasResetButton
              data-not-count
            />
          </>
        )}
      </ErrorBoundary>
      {!imagesLoading ? (
        <div>
          {/*{plantImages !== null ? (*/}
          <Selector
            inputId="preview-image-url"
            choices={plantImages || []}
            choiceType="img"
            defaultValue={defaultValue}
            resetChoice={() => {
              setPlantImages([])
              setImageValue(null)
              setIsFirst(false)
            }}
            setValue={(value) => {
              setImageValue(value);
              if (value !== null) {
                handleImageValueChange(value);
              }
            }}
          />
        </div>
      ) : (
        <p>Chargement des images</p>
      )}
    </>
  );
}

export default PlantImageSelector;

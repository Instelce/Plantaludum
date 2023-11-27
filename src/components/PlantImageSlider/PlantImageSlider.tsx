import { useEffect, useState } from "react";
import classNames from "classnames";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Info,
  X,
} from "react-feather";
import Button from "../ui/Buttons/Button.jsx";
import "./PlantImageSlider.scss";
import { downloadImage } from "../../utils/helpers";
import {ImageType} from "../../services/api/types/images";

type PlantImageSliderProps = {
  imagesData: ImageType[]
}

function PlantImageSlider({ imagesData }: PlantImageSliderProps) {
  const [current, setCurrent] = useState(0);
  const [showImageInfo, setShowImageInfo] = useState(false);
  const length = imagesData?.length;

  // reset imagesData
  const [prevImages, setPrevImages] = useState(imagesData);
  useEffect(() => {
    if (imagesData !== prevImages) {
      setCurrent(() => 0);
      setPrevImages(() => imagesData);
    }
  }, [imagesData]);

  const next = () => {
    setCurrent((current) => (current === length - 1 ? 0 : current + 1));
  };

  const prev = () => {
    setCurrent((current) => (current === 0 ? length - 1 : current - 1));
  };

  if (!Array.isArray(imagesData) || imagesData?.length <= 0) {
    return null;
  }

  const toggleShow = () => {
    setShowImageInfo((show) => !show);
  };

  return (
    <div className="slider">
      <div className="slide-container">
        {prevImages === imagesData && (
          <>
            {imagesData?.map((img, index) => (
              <div
                key={index}
                className={classNames("slide", {
                  active: index === current,
                })}
              >
                <img src={img.url} alt={index.toString()} />
              </div>
            ))}
          </>
        )}

        {!showImageInfo && (
          <>
            <div className="slider-action">
              <Button onlyIcon onClick={prev}>
                <ChevronLeft />
              </Button>
              <p className="slider-info">
                {Array.from(Array(imagesData.length), (e, i) => (
                  <span
                    key={i}
                    tabIndex={i}
                    className={classNames({
                      active: i === current,
                    })}
                    onClick={() => setCurrent(() => i)}
                  ></span>
                ))}
              </p>
              <Button onlyIcon onClick={next}>
                <ChevronRight />
              </Button>
            </div>
            <Button
              onlyIcon
              color="gray"
              size="small"
              className="show-info"
              onClick={() => setShowImageInfo((show) => !show)}
            >
              <Info />
            </Button>
          </>
        )}
      </div>

      {showImageInfo && (
        <div className="images-info">
          <Button
            onlyIcon
            color="gray"
            size="small"
            className="show-info"
            onClick={() => setShowImageInfo((show) => !show)}
          >
            <X />
          </Button>
          @{imagesData[current].author}
          {imagesData[current].location}
          {imagesData[current].publ_date}
          <Button
            className="sb"
            label="Télécharger"
            fill
            onClick={() =>
              downloadImage(
                imagesData[current].url,
                imagesData[current].id.toString(),
              )
            }
          >
            Télécharger
            <ArrowUpRight />
          </Button>
        </div>
      )}
    </div>
  );
}

export default PlantImageSlider;

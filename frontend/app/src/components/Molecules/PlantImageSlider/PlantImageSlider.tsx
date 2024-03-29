import {MutableRefObject, useEffect, useRef, useState} from "react";
import classNames from "classnames";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Download,
  Info,
  X,
} from "react-feather";
import Button from "../../Atoms/Buttons/Button";
import "./PlantImageSlider.scss";
import "../ImageSlider/style.scss";
import { ImageType } from "../../../services/api/types/images";
import BoxList from "../BoxList/BoxList";
import { Link } from "react-router-dom";
import { PlantType } from "../../../services/api/types/plants";
import { downloadImage, getAnotherFormat } from "../../../utils/helpers";

type PlantImageSliderProps = {
  imagesData: ImageType[];
  plantData: PlantType;
  doRefresh?: boolean;
  ref?: MutableRefObject<null>;
};

function PlantImageSlider({
  imagesData,
  plantData,
  doRefresh = true,
  ref,
  ...props
}: PlantImageSliderProps) {
  const [current, setCurrent] = useState(0);
  const [showImageInfo, setShowImageInfo] = useState(false);
  const length = imagesData?.length;

  // reset imagesData
  const [prevImages, setPrevImages] = useState(imagesData);
  useEffect(() => {
    if (doRefresh) {
      if (imagesData !== prevImages) {
        setCurrent(() => 0);
        setPrevImages(() => imagesData);
      }
    }
  }, [imagesData, prevImages, doRefresh]);

  // add image defilement
  const interval = useRef<null | ReturnType<typeof setTimeout>>(null)
  useEffect(() => {
    if (
      localStorage.getItem('settings.imageDefilementEnabled') &&
      localStorage.getItem('settings.imageDefilementTime')
    ) {
      // if enabled
      if (JSON.parse(localStorage.getItem('settings.imageDefilementEnabled') as string)) {
        let cooldown = 3
        if (parseInt(localStorage.getItem('settings.imageDefilementTime') as string) > 0) {
          cooldown = parseInt(localStorage.getItem('settings.imageDefilementTime') as string)
        }
        interval.current = setInterval(() => {
          setCurrent((current) => (current === length - 1 ? 0 : current + 1));
        }, cooldown * 1000)
      }
    }

    return () => {
      if (interval.current) {
        clearInterval(interval.current)
      }
    }
  }, []);

  const next = () => {
    setCurrent((current) => (current === length - 1 ? 0 : current + 1));
  };

  const prev = () => {
    setCurrent((current) => (current === 0 ? length - 1 : current - 1));
  };

  if (!Array.isArray(imagesData) || imagesData?.length === 0) {
    return null;
  }

  return (
    <div className="slider" {...props} ref={ref}>
      <div className="slide-container">
        {((prevImages === imagesData && doRefresh) || !doRefresh) && (
          <>
            {imagesData?.map((img, index) => (
              <div
                key={index}
                className={classNames("slide", {
                  active: index === current,
                })}
              >
                <img src={img.url} alt={`Photo de ${img.author}`} />
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
              size="medium"
              className="show-info"
              onClick={() => setShowImageInfo((show) => !show)}
              bounce={false}
            >
              <Info />
            </Button>
          </>
        )}
        {showImageInfo && (
          <div className="images-info">
            <Button
              onlyIcon
              color="gray"
              size="medium"
              className="show-info"
              onClick={() => setShowImageInfo((show) => !show)}
              bounce={false}
            >
              <X />
            </Button>

            <BoxList.Group size="large" rounded={true}>
              <BoxList.Item>@{imagesData[current].author}</BoxList.Item>
              <BoxList.Item>{imagesData[current].location}</BoxList.Item>
              <BoxList.Item>{imagesData[current].publ_date}</BoxList.Item>
            </BoxList.Group>

            <div className="flex gg-1">
              <Button asChild className="sb" label="Voir plus" fill>
                <Link to={plantData?.eflore_url} target="_blank">
                  Voir plus
                  <ArrowUpRight />
                </Link>
              </Button>
              <Button onlyIcon color="gray" onClick={() => {
                let filename = `${plantData.scientific_name} par ${imagesData[current].author}`
                downloadImage(getAnotherFormat(imagesData[current].url, "O"), filename)
              }}>
                <Download />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlantImageSlider;

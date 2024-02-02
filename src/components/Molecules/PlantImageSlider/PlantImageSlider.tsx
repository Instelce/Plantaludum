import React, { useEffect, useState } from "react";
import classNames from "classnames";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Info,
  X,
} from "react-feather";
import Button from "../../Atoms/Buttons/Button";
import "./PlantImageSlider.scss";
import "../ImageSlider/style.scss";
import { ImageType } from "../../../services/api/types/images";
import BoxListGroup, { BoxListItem } from "../BoxListGroup/BoxListGroup";
import { Link } from "react-router-dom";
import { PlantType } from "../../../services/api/types/plants";

type PlantImageSliderProps = {
  imagesData: ImageType[];
  plantData: PlantType;
  doRefresh?: boolean;
};

function PlantImageSlider({
  imagesData,
  plantData,
  doRefresh = true,
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
    <div className="slider" {...props}>
      <div className="slide-container">
        {(prevImages === imagesData && doRefresh) ||
          (!doRefresh && (
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
          ))}

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
              size="small"
              className="show-info"
              onClick={() => setShowImageInfo((show) => !show)}
              bounce={false}
            >
              <X />
            </Button>

            <BoxListGroup size="large" rounded={true}>
              <BoxListItem>@{imagesData[current].author}</BoxListItem>
              <BoxListItem>{imagesData[current].location}</BoxListItem>
              <BoxListItem>{imagesData[current].publ_date}</BoxListItem>
            </BoxListGroup>

            <Button asChild className="sb" label="Télécharger" fill>
              <Link to={plantData?.eflore_url} target="_blank">
                Voir plus
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlantImageSlider;

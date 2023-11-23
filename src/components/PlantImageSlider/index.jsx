import {useEffect, useState} from "react";
import classNames from "classnames";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Info, X
} from "react-feather";
import PropTypes from "prop-types";
import Button from "../Buttons/Button.jsx";
import "./style.scss"
import ButtonLink from "../Buttons/ButtonLink.jsx";
import {downloadImage} from "../../utils.js";


function PlantImageSlider({imagesData}) {
  const [current, setCurrent] = useState(0)
  const [showImageInfo, setShowImageInfo] = useState(false)
  const length = imagesData?.length;

  // reset imagesData
  const [prevImages, setPrevImages] = useState(imagesData);
  useEffect(() => {
    if (imagesData !== prevImages) {
      setCurrent(() => 0)
      setPrevImages(() => imagesData)
    }
  }, [imagesData]);

  const next = () => {
    setCurrent((current) => current === length - 1 ? 0 : current + 1)
  }

  const prev = () => {
    setCurrent((current) => current === 0 ? length - 1 : current - 1)
  }

  if (!Array.isArray(imagesData) || imagesData?.length <= 0) {
    return null
  }

  const toggleShow = () => {
    setShowImageInfo(show => !show)
  }

  return (
    <div className="slider">
      <div className="slide-container">
        {prevImages === imagesData && <>
          {imagesData?.map((img, index) => (
            <div key={index} className={classNames("slide", {active: index === current})}>
              <img src={img.url} alt={index} />
            </div>
          ))}
        </>}
      </div>

      {!showImageInfo && <>
        <div className="slider-action">
        <Button
          icon={<ChevronLeft />}
          onClick={prev}
        />
        <p className="slider-info">
          {Array.from(Array(imagesData.length), (e, i) => (
            <span
              key={i}
              tabIndex={i}
              className={classNames({active: i === current})}
              onClick={() => setCurrent(() => i)}
            ></span>
          ))}
        </p>
        <Button
          icon={<ChevronRight />}
          onClick={next}
        />
      </div>
      <Button
        icon={<Info />}
        color="gray"
        size="small"
        className="show-info"
        onClick={() => setShowImageInfo(show => !show)}
        />
      </>}

      {showImageInfo && <div className="images-info">
        <Button
          icon={<X />}
          color="gray"
          size="small"
          className="show-info"
          onClick={() => setShowImageInfo(show => !show)}
        />
        @{imagesData[current].author}
        {imagesData[current].location}
        {imagesData[current].publ_date}
        <Button
          label="Télécharger"
          icon={<ArrowUpRight />}
          fill
          onClick={() => downloadImage(
            imagesData[current].url,
            imagesData[current].id.toString(),
          )}
          />
      </div>}
    </div>
  );
}

PlantImageSlider.propTypes = {
  imagesData: PropTypes.arrayOf(PropTypes.object),
}

export default PlantImageSlider;
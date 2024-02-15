import { useEffect, useState } from "react";
import "./style.scss";
import { ArrowLeft, ArrowRight } from "react-feather";
import classNames from "classnames";

function ImageSlider({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const length = images?.length;

  // reset images
  const [prevImages, setPrevImages] = useState(images);
  useEffect(() => {
    if (images !== prevImages) {
      setCurrent(() => 0);
      setPrevImages(() => images);
    }
  }, [images, prevImages]);

  const next = () => {
    setCurrent((current) => (current === length - 1 ? 0 : current + 1));
  };

  const prev = () => {
    setCurrent((current) => (current === 0 ? length - 1 : current - 1));
  };

  if (!Array.isArray(images) || images?.length <= 0) {
    return null;
  }

  return (
    <div className="slider">
      <div className="slide-container">
        {prevImages === images && (
          <>
            {images?.map((src, index) => (
              <div
                key={index}
                className={classNames("slide", {
                  active: index === current,
                })}
              >
                <img src={src} alt={index.toString()} />
              </div>
            ))}
          </>
        )}
      </div>
      <div className="slider-action">
        <ArrowLeft onClick={prev} />
        <p className="slider-info">
          {current + 1}
          <span></span>
          {length}
        </p>
        <ArrowRight onClick={next} />
      </div>
    </div>
  );
}

export default ImageSlider;

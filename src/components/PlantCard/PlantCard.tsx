import "./PlantCard.scss";
import { PlantType } from "../../services/api/types/plants";
import { DragEventHandler, useEffect, useRef, useState } from "react";
import classNames from "classnames";

type PlantCardProps = {
  plant: PlantType;
  images: Array<string>;
};

function PlantCard({ plant, images, ...props }: PlantCardProps) {
  const dragRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [startDrag, setStartDrag] = useState(false);
  const [dragStartPos, setDragStartPos] = useState(0);

  const handleDrag: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    // left
    if (dragStartPos - e.clientX > 100 && startDrag) {
      setCurrentImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      setStartDrag(() => false);
    }
    // right
    if (dragStartPos - e.clientX < -100 && startDrag) {
      setCurrentImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      setStartDrag(() => false);
    }
  };

  const handleDradStart: DragEventHandler<HTMLDivElement> = (e) => {
    setStartDrag(true);
    setDragStartPos(() => e.clientX);
  };

  const handleDradEnd: DragEventHandler<HTMLDivElement> = (e) => {
    setStartDrag(false);
  };

  useEffect(() => {
    const accessibility = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          setCurrentImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
          break;
        case "ArrowRight":
          setCurrentImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
          break;
      }
    };

    if (isFocused) {
      console.log("coucou");
      window.addEventListener("keydown", accessibility);
    }

    return () => {
      window.removeEventListener("keydown", accessibility);
    };
  }, [isFocused]);

  return (
    <div className="plant-card" {...props} autoFocus={true}>
      <a
        tabIndex={0}
        className="focus"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <div
          className={classNames("dragger", { drag: startDrag })}
          onMouseMove={handleDrag}
          onMouseDown={handleDradStart}
          onMouseUp={handleDradEnd}
          draggable={false}
        ></div>
        <div ref={dragRef} className="img-container">
          {images?.map((src, index) => (
            <img
              key={index}
              src={src}
              className={classNames({ active: index === currentImage })}
              alt={`Image de ${plant.french_name}`}
              draggable={false}
            />
          ))}
        </div>
        <div className="card-content">
          <p>{plant.french_name}</p>
        </div>
      </a>
    </div>
  );
}

export default PlantCard;

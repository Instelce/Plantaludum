import React, {useEffect, useRef, useState} from 'react';
import PropTypes from "prop-types";
import Stars from "../Stars/index.jsx";
import './style.scss';

function PlantCard({plant}) {
  const cardRef = useRef(null);
  const cardNameRef = useRef(null)
  const [currentImage, setCurrentImage] = useState(2)

  const handleScroll = (e) => {
    console.log(e)
  }

/*
  useEffect(() => {
      const cardRect = cardRef.current?.getBoundingClientRect()
      let x;

      const handleMoveSlide = (e) => {
        let nameRect = cardNameRef.current?.getBoundingClientRect()

        // console.log(e, cardRect, nameRect)

        x = e.clientX - cardRect.left - nameRect.width / 2

        console.log(x)

        cardNameRef.current.style.transform = `translate(${x}px, 50%)`
      }

      cardNameRef.current.style.transform = `translate(0px, 50%)`

      cardRef.current?.addEventListener("mousemove", handleMoveSlide)

      return () => cardRef.current?.removeEventListener("mousemove", handleMoveSlide)
  }, []);
*/

  return (
    <div className="plant-card" onScroll={handleScroll} ref={cardRef}>
      <div className="image-wrapper">
        <div className="image-container">
          {plant.images.map((src, index) => (
            <img key={src} src={src} alt={src} className={currentImage == index ? "active" : ""}/>
          ))}
        </div>
      </div>
      <div className="card-area"></div>
      <div className="card-name" ref={cardNameRef}>{plant.name}</div>
      <div className="card-content">
        <Stars count={plant.difficulty} />
        <p>{plant.description}</p>
      </div>
    </div>
  );
}

PlantCard.propTypes = {
  plant: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    difficulty: PropTypes.number,
    images: PropTypes.arrayOf(PropTypes.string)
  }))
}

export default PlantCard;
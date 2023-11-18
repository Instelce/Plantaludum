import React, {useEffect, useRef, useState} from 'react';
import PropTypes from "prop-types";
import Stars from "../Stars/index.jsx";
import './style.scss';
import {Link} from "react-router-dom";


function QuizCard({deck, ...props}) {
  const cardRef = useRef(null);
  const cardNameRef = useRef(null)
  const [currentImage, setCurrentImage] = useState(2)

  const handleRightClick = (e) => {
    e.preventDefault()
    cardRef.current?.classList.toggle("show-content")
  }

  const handleMouseLeave = () => {
    cardNameRef.current.style.transform = `translate(-50%, 50%) scale(1)`
    cardNameRef.current.style.left = `50%`
    cardRef.current?.classList.remove("show-content")
    cardRef.current.style.transform = `translate(0, 0)`
  }

  useEffect(() => {
      const cardRect = cardRef.current?.getBoundingClientRect()
      let namePosition, x, y, pos;

      const handleMoveSlide = (e) => {
        let nameRect = cardNameRef.current?.getBoundingClientRect()

        // console.log(e, cardRect, nameRect)
        x = e.pageX - cardRect.left - cardRect.width / 2
        y = e.pageY - cardRect.top - cardRect.height / 2
        pos = e.pageX - cardRect.left - nameRect.width / 2
        namePosition = pos > cardRect.offsetX + cardRect.width / 2 ? pos * -0.15 : pos * 0.15

        // console.log(pos > (cardRect.left + cardRect.right) / 2 ? "right" : "left", (cardRect.left + cardRect.right) / 2, pos)

        cardRef.current.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.05)`

        cardNameRef.current.style.left = `0`
        cardNameRef.current.style.transform = `translate(${namePosition}px, 60%)`
      }

      cardRef.current?.addEventListener("mousemove", handleMoveSlide)

      return () => cardRef.current?.removeEventListener("mousemove", handleMoveSlide)
  }, []);

  return (
    <div className="plant-card" ref={cardRef} onMouseLeave={handleMouseLeave} onAuxClick={handleRightClick} onContextMenu={(e) => e.preventDefault()} {...props}>
      <Link to={`/decks/${deck.id}`}>
        <div className="image-wrapper">
          <div className="image-container">
            <img className="active" src={deck.preview_image_url} alt="Preview image"/>
            {/*{quiz.images.map((src, index) => (*/}
            {/*  <img key={src} src={src} alt={src} className={currentImage == index ? "active" : ""}/>*/}
            {/*))}*/}
          </div>
        </div>
        <div className="card-area"></div>
        <div className="card-name" ref={cardNameRef}>{deck.name}</div>
      </Link>
      <div className="card-content">
        <Stars count={deck.difficulty} />
        <p>{deck.description}</p>
      </div>
    </div>
  );
}

QuizCard.propTypes = {
  deck: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    difficulty: PropTypes.number,
    images: PropTypes.arrayOf(PropTypes.string)
  })
}

export default QuizCard;
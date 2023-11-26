import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Stars from "../ui/Stars/index.jsx";
import "./style.scss";
import { Link } from "react-router-dom";
import Button from "../ui/Buttons/Button.jsx";
import { Zap } from "react-feather";
import Flower from "../ui/Icons";

function DeckCard({ deck, ...props }) {
  const cardRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(2);

  const handleRightClick = (e) => {
    e.preventDefault();
    cardRef.current?.classList.toggle("show-content");
  };

  const handleMouseLeave = () => {
    cardRef.current?.classList.remove("show-content");
    cardRef.current.style.transform = `translate(0, 0)`;
  };

  useEffect(() => {
    const cardRect = cardRef.current?.getBoundingClientRect();
    let x, y;

    const handleMoveSlide = (e) => {
      // console.log(e, cardRect, nameRect)
      x = e.pageX - cardRect.left - cardRect.width / 2;
      y = e.pageY - cardRect.top - cardRect.height / 2;

      // console.log(pos > (cardRect.left + cardRect.right) / 2 ? "right" : "left", (cardRect.left + cardRect.right) / 2, pos)

      cardRef.current.style.transform = `translate(${x * 0.02}px, ${
        y * 0.02
      }px) scale(1.02)`;
    };

    cardRef.current?.addEventListener("mousemove", handleMoveSlide);

    return () =>
      cardRef.current?.removeEventListener("mousemove", handleMoveSlide);
  }, []);

  return (
    <div
      className="deck-card"
      ref={cardRef}
      onMouseLeave={handleMouseLeave}
      onAuxClick={handleRightClick}
      onContextMenu={(e) => e.preventDefault()}
      {...props}
    >
      <div className="card-header">
        <img
          className="active"
          src={deck.preview_image_url}
          alt="Preview image"
        />
        <div className="card-content">
          <h3>{deck.name}</h3>
          <Stars count={deck.difficulty} icon={<Flower />} />
        </div>
      </div>
      <div className="card-button">
        <Button asChild label="Découvrir">
          <Link to={`/decks/${deck.id}`}>Découvrir</Link>
        </Button>
        <Button asChild color="yellow" onlyIcon>
          <Link to={`/decks/${deck.id}/game`}>
            <Zap />
          </Link>
        </Button>
      </div>
    </div>
  );
}

DeckCard.propTypes = {
  deck: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    difficulty: PropTypes.number,
    images: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default DeckCard;

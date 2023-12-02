import React, {useEffect, useRef} from "react";
import Stars from "../ui/Stars/Stars";
import "./DeckCard.scss";
import {Link} from "react-router-dom";
import Button from "../ui/Buttons/Button.jsx";
import {RefreshCw, Zap} from "react-feather";
import Flower from "../ui/Icons";
import {DeckType} from "../../services/api/types/decks";
import useUser from "../../hooks/auth/useUser";

type DeckCardProps = {
  deck: DeckType;
};

function DeckCard({ deck, ...props }: DeckCardProps) {
  const user = useUser();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleRightClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.preventDefault();
    cardRef.current?.classList.toggle("show-content");
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.classList.remove("show-content");
      cardRef.current.style.transform = `translate(0, 0)`;
    }
  };

  useEffect(() => {
    const cardRect = cardRef.current?.getBoundingClientRect();
    let x: number, y: number;
    let currentScrollTop: number;
    const container = document.querySelector(".container") as HTMLDivElement;

    const handleMoveSlide = (e: MouseEvent) => {
      // console.log(e, cardRect, nameRect)
      if (cardRect) {
        x = e.pageX - cardRect.left - cardRect.width / 2;
        y = e.pageY - cardRect.top - cardRect.height / 2 + currentScrollTop;

        if (cardRef.current) {
          cardRef.current.style.transform = `translate(${x * 0.02}px, ${
            y * 0.02
          }px) scale(1.02)`;
        }
      }
    };

    const handleScroll = (e: MouseEvent) => {
      currentScrollTop = container.scrollTop;
    };

    cardRef.current?.addEventListener("mousemove", handleMoveSlide);
    container.addEventListener("scroll", handleScroll);

    return () => {
      cardRef.current?.removeEventListener("mousemove", handleMoveSlide);
      container.removeEventListener("scroll", handleScroll);
    };
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
          <Link to={`/decks/${deck.id}`}>
            {user?.id === deck.user.id ? "Voir" : "Découvrir"}
          </Link>
        </Button>
        {user?.id === deck.user.id && (
          <Button asChild onlyIcon color="yellow">
            <Link to={`/decks/${deck.id}/update`}>
              <RefreshCw />
            </Link>
          </Button>
        )}
        <Button asChild color="yellow" onlyIcon>
          <Link to={`/decks/${deck.id}/game`}>
            <Zap />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default DeckCard;

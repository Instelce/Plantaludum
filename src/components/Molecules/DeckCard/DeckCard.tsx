import React, { PropsWithChildren, useEffect, useRef } from "react";
import Stars from "../../Atoms/Stars/Stars";
import "./DeckCard.scss";
import Flower from "../../Atoms/Icons";
import { DeckType } from "../../../services/api/types/decks";
import useUser from "../../../hooks/auth/useUser";

type DeckCardProps = {
  deck: DeckType;
} & PropsWithChildren;

function Root({ deck, children, ...props }: DeckCardProps) {
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
      <div className="card-button">{children}</div>
    </div>
  );
}

const DeckCard = {
  Root,
};

export default DeckCard;

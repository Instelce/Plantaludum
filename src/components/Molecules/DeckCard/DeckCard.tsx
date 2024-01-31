import React, {Children, PropsWithChildren, useEffect, useRef, useState} from "react";
import Stars from "../../Atoms/Stars/Stars";
import "./DeckCard.scss";
import Flower from "../../Atoms/Icons";
import { DeckType } from "../../../services/api/types/decks";
import Button from "../../Atoms/Buttons/Button";

type DeckCardProps = {
} & PropsWithChildren;

function Root({children, ...props }: DeckCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseLeave = () => {
    if (cardRef.current) {
      // reset card position
      cardRef.current.style.transform = `translate(0, 0)`;
    }
  };

  // mouse follow
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

    // update the current scroll top
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
      onContextMenu={(e) => e.preventDefault()}
      {...props}
    >
      {children}
    </div>
  );
}

type HeaderProps = {
  deck: DeckType,
  height?: number
  children?: React.ReactNode
}

function Header({deck, height = 400, children}: HeaderProps) {
  return (
    <div className="card-header" style={{maxHeight: `${height}px`}}>
      <img
        className="active"
        src={deck.preview_image_url}
        alt="Preview image"
      />
      <div className="card-content">
        <h3>{deck.name}</h3>
        <Stars count={deck.difficulty} icon={<Flower/>}/>
      </div>
      {children}
    </div>
  )
}

function Buttons ({children}: PropsWithChildren) {
  return (
    <div className="card-button">
      {children}
    </div>
  )
}

const DeckCard = {
  Root,
  Header,
  Buttons
};

export default DeckCard;

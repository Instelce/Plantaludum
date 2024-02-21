import React, {
  PropsWithChildren,
  useEffect,
  useRef,
} from "react";
import Stars from "../../Atoms/Stars/Stars";
import "./DeckCard.scss";
import Flower from "../../Atoms/Icons";
import { DeckType } from "../../../services/api/types/decks";
import { getAnotherFormat } from "../../../utils/helpers";
import {AsyncImage} from "../../Atoms/Image/Image";
import classNames from "classnames";

type DeckCardProps = {
  followMouse?: boolean;
} & PropsWithChildren;

function Root({ followMouse = true, children, ...props }: DeckCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseLeave = () => {
    if (cardRef.current && followMouse) {
      // reset card position
      cardRef.current.style.transform = `translate(0, 0)`;
    }
  };

  // mouse follow
  useEffect(() => {
    if (followMouse) {
      const currentCardRef = cardRef.current;
      const cardRect = currentCardRef?.getBoundingClientRect();
      let x: number, y: number;
      let currentScrollTop: number;
      const container = document.querySelector(".container") as HTMLDivElement;

      const handleMoveSlide = (e: MouseEvent) => {
        // console.log(e, cardRect, nameRect)
        if (cardRect) {
          x = e.pageX - cardRect.left - cardRect.width / 2;
          y = e.pageY - cardRect.top - cardRect.height / 2 + currentScrollTop;

          if (currentCardRef) {
            currentCardRef.style.transform = `translate(${x * 0.02}px, ${
              y * 0.03
            }px) scale(1.02)`;
          }
        }
      };

      // update the current scroll top
      const handleScroll = () => {
        // console.log("", container.scrollTop)
        currentScrollTop = container.scrollTop;
      };

      container.addEventListener("scroll", handleScroll);
      currentCardRef?.addEventListener("mousemove", handleMoveSlide);

      return () => {
        container.removeEventListener("scroll", handleScroll);
        currentCardRef?.removeEventListener("mousemove", handleMoveSlide);
      };
    }
  }, []);

  return (
    <div
      className={classNames("deck-card", {grow: !followMouse})}
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
  deck: DeckType;
  height?: number;
  children?: React.ReactNode;
};

function Header({ deck, height = 400, children }: HeaderProps) {
  return (
    <div className="card-header" style={{ maxHeight: `${height}px` }}>
      <AsyncImage
        className="active"
        src={getAnotherFormat(deck.preview_image_url, "CRL")}
        alt="Photo de présentation"
      />
      <div className="card-content">
        <h3>{deck.name}</h3>
        <Stars count={deck.difficulty} icon={<Flower />} />
      </div>
      {children}
    </div>
  );
}

function Buttons({ children }: PropsWithChildren) {
  return <div className="card-button">{children}</div>;
}

const DeckCard = {
  Root,
  Header,
  Buttons,
};

export default DeckCard;

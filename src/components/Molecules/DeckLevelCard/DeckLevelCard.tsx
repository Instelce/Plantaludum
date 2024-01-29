import "./DeckLevelCard.scss";
import classNames from "classnames";
import { Lock } from "react-feather";
import { Link } from "react-router-dom";
import { DeckType } from "../../../services/api/types/decks";
import Stars from "../../Atoms/Stars/Stars";

type DeckLevelCardProps = {
  deck: DeckType;
  level: number;
  levelStars: number;
  isReached?: boolean;
};

function DeckLevelCard({
  deck,
  level,
  levelStars,
  isReached,
}: DeckLevelCardProps) {
  return (
    <Link
      to={isReached ? `/decks/${deck.id}/game/${level}` : "#"}
      className={classNames("deck-level-card", `level-${level}`, {
        "not-reached": !isReached,
      })}
    >
      {isReached && (
        <>
          <Stars count={levelStars} />
        </>
      )}

      {!isReached && (
        <div className="lock">
          <Lock size={40} />
        </div>
      )}
    </Link>
  );
}

export default DeckLevelCard;

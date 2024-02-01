import React from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import Navbar from "../../components/Organisms/Navbar/Navbar";
import Button from "../../components/Atoms/Buttons/Button";
import useUser from "../../hooks/auth/useUser";
import Stars from "../../components/Atoms/Stars/Stars";
import DeckLevelCard from "../../components/Molecules/DeckLevelCard/DeckLevelCard";
import { ArrowLeft, ArrowRight } from "react-feather";
import ConfettiExplosion from "react-confetti-explosion";

function DeckGameResult() {
  const { deckId, deckLevel } = useParams();
  const user = useUser();

  const location = useLocation();
  const deckGameResultData = location.state?.data;

  if (!deckGameResultData) {
    return <Navigate to={`/decks/${deckId}`} />;
  }

  return (
    <div className="deck-results">
      <Navbar.Root>
        <Navbar.Left>
          <Link to="/mon-jardin">Mon jardin</Link>
          <Link to="/explorer">Explorer</Link>
        </Navbar.Left>
        <Navbar.Right>
          {user && (
            <Button asChild label="Nouveau deck" size="large" color="gray">
              <Link
                to="/decks/create"
                state={{ from: { pathname: location.pathname } }}
              >
                Nouveau deck
              </Link>
            </Button>
          )}
        </Navbar.Right>
      </Navbar.Root>

      <header>
        <div>
          <p>{deckGameResultData.times}</p>
          <h2>{deckGameResultData.score}</h2>
          <Stars count={deckGameResultData.stars} />
          {deckGameResultData.stars === 3 && <>
            <ConfettiExplosion force={0.6} duration={2500} particleCount={80} width={1000} />
          </>}
        </div>
      </header>

      <div className="content-container grid-buttons">
        <Button asChild className="sb" color="gray" disabled={parseInt(deckLevel) === 1}>
          <Link to={`/decks/${deckId}/game/${deckGameResultData.level - 1}`}>
            <ArrowLeft />
            Niveau précédent
          </Link>
        </Button>

        <Button asChild color={deckGameResultData.stars === 3 ? "gray" : "primary"}>
          <Link to={`/decks/${deckId}/game/${deckGameResultData.level}`}>
            Recommencer
          </Link>
        </Button>

        {deckGameResultData.stars === 3 || parseInt(deckLevel) < 3 && <Button asChild className="sb">
          <Link to={`/decks/${deckId}/game/${deckGameResultData.level + 1}`}>
            Niveau suivant
            <ArrowRight />
          </Link>
        </Button>}

      </div>
    </div>
  );
}

export default DeckGameResult;

import React from "react";
import {Link, Navigate, useLocation, useParams} from "react-router-dom";
import Navbar from "../../components/Organisms/Navbar/Navbar";
import Button from "../../components/Atoms/Buttons/Button";
import useUser from "../../hooks/auth/useUser";
import Stars from "../../components/Atoms/Stars/Stars";
import DeckLevelCard
  from "../../components/Molecules/DeckLevelCard/DeckLevelCard";
import {ArrowLeft, ArrowRight} from "react-feather";

function DeckGameResult() {
  const { deckId, deckLevel } = useParams();
  const user = useUser()

  const location = useLocation()
  const deckGameResultData = location.state?.data

  if (!deckGameResultData) {
    return <Navigate to={`/decks/${deckId}`} />
  }

  return (
    <div className="deck-results">
      <Navbar>
        <div className="left">
          <Link to="/mon-jardin">Mon jardin</Link>
          <Link to="/explorer">Explorer</Link>
        </div>
        <div className="right">
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
        </div>
      </Navbar>

      <header>
        <div>
          <p>{deckGameResultData.times}</p>
          <h2>{deckGameResultData.score}</h2>
          <Stars count={deckGameResultData.stars} />
        </div>
        <DeckLevelCard deck={deckGameResultData.deck} level={deckGameResultData.level} levelStars={deckGameResultData.stars} isReached={true} />
      </header>

      <div className="grid-buttons">
        <Button asChild label="" className="sb">
          <Link to={`/decks/${deckId}/game/${deckGameResultData.level - 1}`}>
            <ArrowLeft />
            Niveau précédent
          </Link>
        </Button>
        <Button asChild label="">
          <Link to={`/decks/${deckId}/game/${deckGameResultData.level}`}>
            Recommencer
          </Link>
        </Button>
        <Button asChild label="" className="sb">
          <Link to={`/decks/${deckId}/game/${deckGameResultData.level + 1}`}>
            Niveau suivant
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default DeckGameResult;

import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import Button from "../../components/Atoms/Buttons/Button";
import Stars from "../../components/Atoms/Stars/Stars";
import { ArrowLeft, ArrowRight } from "react-feather";
import ConfettiExplosion from "react-confetti-explosion";
import { useAuth } from "../../context/AuthProvider";
import Header from "../../components/Molecules/Header/Header";

function DeckGameResult() {
  const { deckId, deckLevel } = useParams();
  const { accessToken } = useAuth();

  const location = useLocation();
  const deckGameResultData = location.state?.data;

  if (!deckGameResultData) {
    return <Navigate to={`/decks/${deckId}`} />;
  }

  return (
    <div className="deck-results">
      <header>
        <div>
          <p>{deckGameResultData.times}</p>
          <h2>{deckGameResultData.score}</h2>
          <Stars count={deckGameResultData.stars} />
          {deckGameResultData.stars === 3 && (
            <>
              <ConfettiExplosion
                force={0.6}
                duration={2500}
                particleCount={80}
                width={1000}
              />
            </>
          )}
        </div>
      </header>

      <Header.Root type="section">
        <Header.Title className="h3">{deckGameResultData.deck.name} niveau {deckLevel}</Header.Title>
      </Header.Root>

      <div className="content-container grid-buttons">
        {deckGameResultData.level > 1 ? (
          <Button asChild className="sb" color="gray">
            <Link to={`/decks/${deckId}/game/${deckGameResultData.level - 1}`}>
              <ArrowLeft />
              Niveau précédent
            </Link>
          </Button>
        ) : (
          <span></span>
        )}

        <Button
          asChild
          color={deckGameResultData.stars === 3 ? "gray" : "primary"}
        >
          <Link to={`/decks/${deckId}/game/${deckGameResultData.level}`}>
            Recommencer
          </Link>
        </Button>

        {deckGameResultData.stars === 3 && deckGameResultData.level < 3 && (
          <Button asChild className="sb">
            <Link to={`/decks/${deckId}/game/${deckGameResultData.level + 1}`}>
              Niveau suivant
              <ArrowRight />
            </Link>
          </Button>
        )}
      </div>

      {!accessToken && (
        <div className="content-container center">
          <p>
            Veuillez vous{" "}
            <Link to="/connexion" className="link">
              connecter
            </Link>{" "}
            pour sauvegarder votre progression.
          </p>
        </div>
      )}
    </div>
  );
}

export default DeckGameResult;

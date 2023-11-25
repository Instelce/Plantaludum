import React from "react";
import Button from "../../components/ui/Buttons/Button.jsx";
import ButtonLink from "../../components/ui/Buttons/ButtonLink.jsx";
import { useParams } from "react-router-dom";

function DeckGameResult(props) {
  const { quizId } = useParams();
  return (
    <div className="quiz-results">
      <div className="quiz-score">
        <h2>Bravo !</h2>
        <div className="quiz-stats">
          <div>
            Temps
            <span>2:43</span>
          </div>
          <div>
            Score
            <span>2400</span>
          </div>
        </div>
        <div className="stars"></div>
        <div className="quiz-buttons">
          <Button
            label="Partager"
            fill
            variant="outlined"
            size="big"
            color="secondary"
          />
          <ButtonLink
            label="Recommencer"
            to={`/quiz/${quizId}`}
            fill
            variant="outlined"
            size="big"
            color="secondary"
          />
          <ButtonLink
            label="Retour"
            to="/menu"
            fill
            variant="solid"
            size="big"
            color="primary"
          />
        </div>
      </div>
      <div className="quiz-leaderboard">leaderboard...</div>
    </div>
  );
}

export default DeckGameResult;

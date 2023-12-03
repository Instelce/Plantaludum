import React from "react";
import Button from "../../components/Atoms/Buttons/Button.jsx";
import {useParams} from "react-router-dom";

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
          <Button
            label="Recommencer"
            to={`/quiz/${quizId}`}
            fill
            variant="outlined"
            size="big"
            color="secondary"
          />
          <Button
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

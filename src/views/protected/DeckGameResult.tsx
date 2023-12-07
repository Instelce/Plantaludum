import React from "react";
import {useParams} from "react-router-dom";
import Header from "../../components/Molecules/Header/Header";
import Navbar from "../../components/Organisms/Navbar/Navbar";

function DeckGameResult(props) {
  const { deckId } = useParams();
  return (
    <div className="quiz-results">
      <Navbar>

      </Navbar>

      <Header.Root type="page">
        <Header.Title>Results</Header.Title>
      </Header.Root>
    </div>
  );
}

export default DeckGameResult;

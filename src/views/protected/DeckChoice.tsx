import React, { useRef } from "react";
import Input from "../../components/Atoms/Input/Input";
import { Link } from "react-router-dom";
import "locomotive-scroll/src/locomotive-scroll.scss";
import Checkbox from "../../components/Atoms/Checkbox/Checkbox";
import Stars from "../../components/Atoms/Stars/Stars";

const quizzes = [
  {
    src: "https://api.tela-botanica.org/img:000244988CRS.jpg",
    name: "Les plantes sauvages",
    plants: 6,
    difficulty: 2,
    url: "/quiz/1/game",
  },
  {
    src: "https://api.tela-botanica.org/img:000192173CRS.jpg",
    name: "Les plantes commestibles",
    plants: 10,
    difficulty: 3,
    url: "/quiz/2/game",
  },
  {
    src: "https://api.tela-botanica.org/img:000244988CRS.jpg",
    name: "Les plantes sauvages",
    plants: 6,
    difficulty: 2,
    url: "/quiz/3/game",
  },
  {
    src: "https://api.tela-botanica.org/img:000192173CRS.jpg",
    name: "Les plantes commestibles",
    plants: 10,
    difficulty: 3,
    url: "/quiz/4/game",
  },
];

function DeckChoice(props) {
  const scrollRef = useRef(null);

  return (
    <div className="container quiz-choice">
      <h1 className="main-title">Plantaludum</h1>
      <Panel />
      <div className="card-container" ref={scrollRef}>
        <div className="card-wrapper">
          {quizzes.map((quiz, index) => (
            <Card key={quiz.src} index={index} quiz={quiz} />
          ))}
        </div>
      </div>
      <span className="dashed-lines"></span>
    </div>
  );
}

function Panel(props) {
  return (
    <div className="quiz-panel">
      <Input label="Recherche" size="lg" type="search" />
      <Checkbox label="Arranger par couleur" value={false} />
      <Checkbox label="Arranger par taille" value={false} />
      <Checkbox label="Arranger par difficulté" value={false} />
    </div>
  );
}

function Card({ quiz }) {
  return (
    <Link to={quiz.url} className="quiz-card">
      <div className="image-container">
        <img src={quiz.src} />
      </div>
      <div className="quiz-info">
        <h6>{quiz.name}</h6>
        <div>
          <p>{quiz.plants} plantes</p>
          <Stars count={quiz.difficulty} />
        </div>
      </div>
    </Link>
  );
}

export default DeckChoice;

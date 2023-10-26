import React, { useEffect, useRef } from "react";
import Input from "../../components/forms/Input/index.jsx";
import { Link } from "react-router-dom";
import LocomotiveScroll from "locomotive-scroll";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

import "locomotive-scroll/src/locomotive-scroll.scss";
import Checkbox from "../../components/forms/Checkbox/index.jsx";

const quizzes = [
  {
    src: "https://api.tela-botanica.org/img:000244988CRS.jpg",
    name: "Les plantes sauvages",
    plants: 6,
    difficulty: 2,
    url: "/quiz/1",
  },
  {
    src: "https://api.tela-botanica.org/img:000192173CRS.jpg",
    name: "Les plantes commestibles",
    plants: 10,
    difficulty: 3,
    url: "/quiz/2",
  },
  {
    src: "https://api.tela-botanica.org/img:000244988CRS.jpg",
    name: "Les plantes sauvages",
    plants: 6,
    difficulty: 2,
    url: "/quiz/3",
  },
  {
    src: "https://api.tela-botanica.org/img:000192173CRS.jpg",
    name: "Les plantes commestibles",
    plants: 10,
    difficulty: 3,
    url: "/quiz/4",
  },
];

function QuizChoice(props) {
  const scrollRef = useRef(null);

  useEffect(() => {}, []);

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
          <p>{quiz.difficulty}</p>
        </div>
      </div>
    </Link>
  );
}

export default QuizChoice;

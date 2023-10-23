import React, {useEffect, useState} from 'react';
import Slider from "../../components/Slider/index.jsx";
import ChoiceBlock from "../../components/ChoiceBlock/index.jsx";
import {RefreshCw, Star, X} from "react-feather";
import {useTimer} from "../../hooks/useTimer.js";
import {Link, useNavigate, useParams} from "react-router-dom";

const plantsSrc = [
    "https://api.tela-botanica.org/img:000243414CRS.jpg",
    "https://api.tela-botanica.org/img:000208259CRS.jpg",
    "https://api.tela-botanica.org/img:000244988CRS.jpg",
    "https://api.tela-botanica.org/img:000073996CRS.jpg",
    "https://api.tela-botanica.org/img:000192173CRS.jpg",
    "https://api.tela-botanica.org/img:002479913CRS.jpg",
    "https://api.tela-botanica.org/img:000116167CRS.jpg",
    "https://api.tela-botanica.org/img:000092753CRS.jpg",
    "https://api.tela-botanica.org/img:002251388CRS.jpg",
    "https://api.tela-botanica.org/img:001118914CRS.jpg",
]

const questions = [
    [
        {name: "1", scientifiqueName: "Lorem a", rightAnswer: false},
        {name: "2", scientifiqueName: "Lorem b", rightAnswer: true},
        {name: "3", scientifiqueName: "Lorem b", rightAnswer: false}
    ],
    [
        {name: "1b", scientifiqueName: "Lorem a", rightAnswer: false},
        {name: "2b", scientifiqueName: "Lorem b", rightAnswer: false},
        {name: "3b", scientifiqueName: "Lorem b", rightAnswer: true}
    ],
    [
        {name: "1", scientifiqueName: "Lorem a", rightAnswer: false},
        {name: "2", scientifiqueName: "Lorem b", rightAnswer: true},
        {name: "3", scientifiqueName: "Lorem b", rightAnswer: false},
        {name: "4", scientifiqueName: "Lorem c", rightAnswer: false}
    ],
    [
        {name: "1n", scientifiqueName: "Lorem a", rightAnswer: true},
        {name: "2n", scientifiqueName: "Lorem b", rightAnswer: false},
        {name: "3c", scientifiqueName: "Lorem b", rightAnswer: false}
    ],
    // [
    //     {name: "1n", scientifiqueName: "Lorem a", rightAnswer: false},
    //     {name: "2n", scientifiqueName: "Lorem a", rightAnswer: false},
    //     {name: "3n", scientifiqueName: "Lorem a", rightAnswer: false},
    //     {name: "4n", scientifiqueName: "Lorem b", rightAnswer: true},
    //     {name: "5c", scientifiqueName: "Lorem b", rightAnswer: false}
    // ]
]


const choices = [
    {name: "Vesce fausse-esparcette", scientifiqueName: "Abacosa onobrychioides", rightAnswer: false},
    {name: "Narth\u00e9cie des marais", scientifiqueName: "Abama ossifraga", rightAnswer: true},
    {name: "AANarth\u00e9cie des marais", scientifiqueName: "Abamaa", rightAnswer: false}
]


function QuizPage(props) {
    const navigate = useNavigate();
    let { quizId } = useParams()
    const {stringTime, start, reset} = useTimer({startValue:5})
    const [stars, setStars] = useState(2)
    const [progress, setProgress] = useState(0)
    const [showResult, setShowResult] = useState(false)
    const [score, setScore] = useState(0)
    // const [currentQuestion, setCurrentQuestion] = useState(0)

    useEffect(() => {
        console.log("start")
        start()
    }, []);

    useEffect(() => {
        if (showResult && progress < questions.length) {
            setTimeout(() => {
                setProgress(p => p + 1);
                setShowResult(false);
            }, 1000);
        }
        if (progress === questions.length) {
            navigate(`resultat`);
        }
    }, [showResult]);

    const resetQuiz = () => {
        reset();
        setProgress(0);
        setShowResult(false);
    }

    // const checkResult = (bool, ) => {
    //
    // }

    return (
        <div className="container center quiz-page">
            <div className="quiz-wrapper">
                <div className="quiz-header">
                    <div className="quiz-timer">
                        <span>{stringTime}</span>
                        <RefreshCw onClick={() => resetQuiz()} />
                        <Link to="/menu/choix">
                            <X />
                        </Link>
                    </div>
                    <div className="quiz-score">
                        600
                    </div>
                    <div className="quiz-star">
                        <Stars count={stars} />
                    </div>
                </div>
                <div className="quiz-progress-bar">
                    <span style={{ width: `${progress * 100 / questions.length}%` }}></span>
                </div>
                <div className="quiz-content">
                    <Slider images={plantsSrc} />
                    <div>
                        {questions[progress]?.map((choice, index) => (
                            <ChoiceBlock key={choice.name} index={index} choice={choice} showResult={showResult} setShowResult={setShowResult} />
                        ))}
                        <p>Double click sur la réponse de ton choix</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Stars ({count}) {
    let starsElem = []
    for (let i = 0; i < count; i++) {
        starsElem.push(<Star color="#FFCC00" fill="#FFCC00" />)
    }
    for (let i = 0; i < 3 - count; i++) {
        starsElem.push(<Star color="rgba(var(--color-secondary), .2)" fill="rgba(var(--color-secondary), .2)" />)
    }

    return <>
        {starsElem}
    </>
}

export default QuizPage;
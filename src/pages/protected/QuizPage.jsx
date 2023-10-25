import React, {useEffect, useState} from 'react';
import ImageSlider from "../../components/ImageSlider/index.jsx";
import ChoiceBlock from "../../components/ChoiceBlock/index.jsx";
import {RefreshCw, Star, X} from "react-feather";
import {useTimer} from "../../hooks/useTimer.js";
import {Link, redirect, useNavigate, useParams} from "react-router-dom";

const plantsSrc = [
    "https://images.unsplash.com/photo-1670788050449-32d3139a34c5?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDExfEpwZzZLaWRsLUhrfHxlbnwwfHx8fHw%3D",
    "https://images.unsplash.com/photo-1697638332466-16f48f835b96?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDh8SnBnNktpZGwtSGt8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1697273300766-5bbaa53ec2f0?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM1fEpwZzZLaWRsLUhrfHxlbnwwfHx8fHw%3D",
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
    {
        images: [
            "https://api.tela-botanica.org/img:000092753CRS.jpg",
            "https://api.tela-botanica.org/img:002251388CRS.jpg",
            "https://api.tela-botanica.org/img:001118914CRS.jpg",
        ],
        choices: [
            {title: "1", subtitle: "Lorem a", rightAnswer: false},
            {title: "2", subtitle: "Lorem b", rightAnswer: true},
            {title: "3", subtitle: "Lorem b", rightAnswer: false}
        ]
    },
    {
        images: [
            "https://api.tela-botanica.org/img:000243414CRS.jpg",
            "https://api.tela-botanica.org/img:000208259CRS.jpg",
            "https://api.tela-botanica.org/img:000244988CRS.jpg",
            "https://api.tela-botanica.org/img:000073996CRS.jpg",
        ],
        choices: [
            {title: "1b", subtitle: "Lorem a", rightAnswer: false},
            {title: "2b", subtitle: "Lorem b", rightAnswer: false},
            {title: "3b", subtitle: "Lorem b", rightAnswer: true}
        ]
    },
    {
        images: [
            "https://api.tela-botanica.org/img:000244988CRS.jpg",
            "https://api.tela-botanica.org/img:000073996CRS.jpg",
            "https://api.tela-botanica.org/img:000192173CRS.jpg",
            "https://api.tela-botanica.org/img:002479913CRS.jpg",
            "https://api.tela-botanica.org/img:000116167CRS.jpg",
            "https://api.tela-botanica.org/img:000092753CRS.jpg",
        ],
        choices: [
            {title: "1", subtitle: "Lorem a", rightAnswer: false},
            {title: "2", subtitle: "Lorem b", rightAnswer: true},
            {title: "3", subtitle: "Lorem b", rightAnswer: false},
            {title: "4", subtitle: "Lorem c", rightAnswer: false}
        ]
    },
    {
        images: [
            "https://api.tela-botanica.org/img:000243414CRS.jpg",
            "https://api.tela-botanica.org/img:000208259CRS.jpg",
            "https://api.tela-botanica.org/img:000244988CRS.jpg",
            "https://api.tela-botanica.org/img:000073996CRS.jpg",
        ],
        choices: [
            {title: "1n", subtitle: "Lorem a", rightAnswer: false},
            {title: "2n", subtitle: "Lorem a", rightAnswer: false},
            {title: "3n", subtitle: "Lorem a", rightAnswer: false},
            {title: "4n", subtitle: "Lorem b", rightAnswer: true},
            {title: "5c", subtitle: "Lorem b", rightAnswer: false}
        ]
    },
    {
       images: [
           "https://images.unsplash.com/photo-1670788050449-32d3139a34c5?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDExfEpwZzZLaWRsLUhrfHxlbnwwfHx8fHw%3D",
           "https://images.unsplash.com/photo-1697638332466-16f48f835b96?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDh8SnBnNktpZGwtSGt8fGVufDB8fHx8fA%3D%3D",
           "https://images.unsplash.com/photo-1697273300766-5bbaa53ec2f0?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM1fEpwZzZLaWRsLUhrfHxlbnwwfHx8fHw%3D",
           "https://api.tela-botanica.org/img:000243414CRS.jpg",
           "https://api.tela-botanica.org/img:000208259CRS.jpg",
           "https://api.tela-botanica.org/img:000244988CRS.jpg",
       ],
        choices: [
            {title: "1n", subtitle: "Lorem a", rightAnswer: true},
            {title: "2n", subtitle: "Lorem b", rightAnswer: false},
            {title: "3c", subtitle: "Lorem b", rightAnswer: false}
        ]
    }
]


function QuizPage(props) {
    const navigate = useNavigate();
    let { quizId } = useParams()
    const {stringTime, start, reset} = useTimer({startValue:5})
    const [stars, setStars] = useState(0)
    const [progress, setProgress] = useState(0)
    const [showResult, setShowResult] = useState(false)
    const [score, setScore] = useState(0)
    const [isRight, setIsRight] = useState(undefined)
    const [userErrors, setUserErrors] = useState(0)
    // const [currentQuestion, setCurrentQuestion] = useState(0)

    useEffect(() => {
        console.log("start")
        start()
    }, []);

    useEffect(() => {
        // reset values
        if (progress === 0) {
            setStars(0)
        }

        // set stars
        if (progress % 3 === 3 && progress - userErrors > 1) {
            setStars(s => s + 1)
        }

        // update progress
        if (showResult && progress < questions.length) {
            setTimeout(() => {
                setProgress(p => p + 1);
                setShowResult(false);
            }, 1000);
        }

        // redirect to result page if quiz is finished
        if (progress === questions.length) {
            setTimeout(() => {
                navigate(`/quiz/${quizId}/resultat`);
            }, 2000)
        }
    }, [showResult]);

    useEffect(() => {
        // update score
        if (isRight !== undefined) {
            if (isRight) {
                setScore(s => s + 200)
            } else {
                setUserErrors(e => e + 1);
            }
            setIsRight(undefined)
        }
    }, [isRight]);

    const resetQuiz = () => {
        reset();
        setProgress(0);
        setShowResult(false);
    }

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
                        {score}
                    </div>
                    <div className="quiz-star">
                        <Stars count={stars} />
                    </div>
                </div>
                <div className="quiz-progress-bar">
                    <span style={{ width: `${progress * 100 / questions.length}%` }}></span>
                </div>
                <div className="quiz-content">
                    <ImageSlider images={questions[progress]?.images} />
                    <div>
                        {questions[progress] ? (
                            <>
                                {questions[progress]?.choices.map((choice, index) => (
                                    <ChoiceBlock key={choice.title} index={index} choice={choice} showResult={showResult} setShowResult={setShowResult} setIsRight={setIsRight} />
                                ))}
                                <p>Double click sur la réponse de ton choix</p>
                            </>
                        ) : (
                           <p>Fini !</p>
                        )}
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
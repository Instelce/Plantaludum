import React, {useEffect, useRef, useState} from 'react';
import ImageSlider from "../../components/ImageSlider/index.jsx";
import ChoiceBlock from "../../components/ChoiceBlock/index.jsx";
import {RefreshCw, Star, X} from "react-feather";
import {useTimer} from "../../hooks/useTimer.js";
import {Link, redirect, useNavigate, useParams} from "react-router-dom";
import Stars from "../../components/Stars/index.jsx";
import ProgressBar from "../../components/ProrgessBar/index.jsx";
import useQuiz from "../../hooks/api/useQuiz.js";
import {arrayChoice, deleteDublicates, shuffleArray} from "../../utils.js";
import {ErrorBoundary} from "react-error-boundary";


function QuizGame(props) {
    const navigate = useNavigate();
    let { quizId } = useParams()

    const maxQuestions = 30;
    const [showResult, setShowResult] = useState(false)
    const [isRight, setIsRight] = useState(undefined)
    const {stringTime, start, reset} = useTimer({startValue:5})
    const [userErrors, setUserErrors] = useState(0)

    // Stats
    const [score, setScore] = useState(0)
    const [stars, setStars] = useState(0)
    const [progress, setProgress] = useState(0)

    const [plantsData, setPlantsData] = useState(null)
    const [currentPlant, setCurrentPlant] = useState(null)
    const [currentImages, setCurrentImages] = useState(null)

    const quizContent = useRef(null)

    const {
        quizQuery,
        quizPlantsQuery,
        quizPlantsImagesQuery
    } = useQuiz({
        quizId,
        fetchPlants: true,
        fetchImages: true,
    })

    // useEffect(() => {
    //     console.log(quizPlantsImagesQuery.isLoading)
    //     if (quizPlantsImagesQuery.isSuccess) {
    //         console.log(quizQuery.data)
    //         console.log(quizPlantsQuery.data)
    //         console.log(quizPlantsImagesQuery.data)
    //     }
    // }, [quizPlantsImagesQuery.isSuccess]);

    useEffect(() => {
        start()
    }, []);

    // get new plant on start
    useEffect(() => {
        console.log("start p")
        if (quizPlantsImagesQuery.isSuccess && quizPlantsQuery.isFetched) {
            setPlantsData(() => quizPlantsQuery.data)
            console.log("plants data", plantsData)
            const currentPlantData = arrayChoice(quizPlantsQuery.data)[0]
            setCurrentPlant(() => currentPlantData)

            console.log(Object.values(quizPlantsImagesQuery.data)
              .filter(v => v.id === currentPlantData.id)
              .map(v => v.images)[0]
              .map(im => im.url))
    }
    }, [quizPlantsQuery.isSuccess, quizPlantsImagesQuery.isSuccess, currentPlant, plantsData]);

    // set images
    useEffect(() => {
        console.log("id", currentPlant?.scientific_name)
        if (currentPlant) {
            let tempImagesData = quizPlantsImagesQuery.data
            setCurrentImages(() =>
              shuffleArray(arrayChoice(deleteDublicates(Object.values(tempImagesData)
                ?.filter(v => v.id === currentPlant.id)
                ?.map(v => v.images)[0]
                ?.map(im => im.url)), 5)))

            console.log(currentImages)
        }
    }, [currentPlant]);

    // is show results
    useEffect(() => {
        // reset values
        if (progress === 0) {
            setStars(0)
        }

        // set stars
        if (progress % 3 === 3 && progress - userErrors > 1) {
            setStars(s => s + 1)
        }

        if (showResult && progress < maxQuestions) {
           let changeData = setTimeout(() => {
                // choose another images
                const currentPlantData = arrayChoice(quizPlantsQuery.data)[0]
                setCurrentPlant(() => currentPlantData)

                // shuffle plants
                setPlantsData(data => shuffleArray(data))

                // update progress
                setProgress(p => p + 1);
                setShowResult(false);
            }, 1000);

           return () => {
               clearTimeout(changeData)
           }
        }

        // redirect to result page if quiz is finished
        if (progress === maxQuestions + 1) {
            setTimeout(() => {
                navigate(`/quiz/${quizId}/game/resultat`);
            }, 2000)
        }

    }, [showResult]);

    // update score
    useEffect(() => {
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

                    <Stars count={stars} />
                </div>

                <ProgressBar value={progress * 100 / maxQuestions} color="rgb(var(--color-primary))" thickness="large" shape="rounded" />

                {currentImages && currentPlant && <div className="quiz-content" ref={quizContent}>
                    {currentImages && <ImageSlider images={currentImages} />}

                    <div>
                        {quizPlantsQuery.isSuccess ? (
                            <>
                                {plantsData.map((plant, index) => (
                                    <ChoiceBlock
                                      key={plant.id}
                                      index={index}
                                      title={plant.french_name}
                                      subtitle={plant.scientific_name}
                                      isRightAnswer={plant.id === currentPlant.id}
                                      showResult={showResult}
                                      setShowResult={setShowResult}
                                      setIsRight={setIsRight} />
                                ))}
                                <p>Double click sur la réponse de ton choix</p>
                            </>
                        ) : (
                           <p>Fini !</p>
                        )}
                    </div>
                </div>}

            </div>
        </div>
    );
}



export default QuizGame;
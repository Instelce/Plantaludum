import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';

import './style.scss'
import ChoiceBlock from "../ChoiceBlock/index.jsx";
import ImageSlider from "../ImageSlider/index.jsx";
import {X} from "react-feather";
import PropTypes from "prop-types";
import {getRandomInt} from "../../utils.js";

function PlantQuiz({show, setShow, plant, handleQuizSubmit}) {
    const ref = useRef(null)
    const [showResult, setShowResult] = useState(false)

    const close = () => {
        console.log('##', showResult, plant.found)
        setShow(!show)
        quizSubmit(plant, showResult)
        setShowResult(false)
    }

    useEffect(() => {
        if (ref.current.classList.contains('show') && plant.found) {
            setShowResult(true)
        } else if (!ref.current.classList.contains('show') && plant.found) {
            setShowResult(false)
        }
    }, [show]);

    return (
        <div ref={ref} className={`plant-quiz ${show ? 'show' : 'no-show'}`}>
            <div>
                <div className="quiz-action" onClick={close}>
                    <X />
                </div>
            </div>
            <div className="quiz-wrapper">
                <ImageSlider images={plant.images} />

                <div className="quiz-body">
                    <div className="quiz-header">
                        <h2>Quelle est cette plante ?</h2>
                        <p>Double click sur la réponse de ton choix</p>
                    </div>

                    <div className="quiz-choices">
                        {plant.choices?.map((choice, index) => (
                          <div
                            key={choice.scientifiqueName}
                          >
                            <ChoiceBlock
                                index={index}
                                choice={choice}
                                showResult={showResult}
                                setShowResult={setShowResult}
                            />
                          </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


PlantQuiz.propTypes = {
    show: PropTypes.bool,
    setShow: PropTypes.func,
    plant: PropTypes.shape({
        src: PropTypes.string,
        size: PropTypes.number,
        name: PropTypes.string,
        found: PropTypes.bool,
        x: PropTypes.number,
        y: PropTypes.number,
        images: PropTypes.array,
        choices: PropTypes.array,
    }),
    handleQuizSubmit: PropTypes.func
}

export default PlantQuiz;
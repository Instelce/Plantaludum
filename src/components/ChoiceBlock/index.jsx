import React, {useEffect, useRef, useState} from 'react';

import './style.scss'
import {Check, X} from "react-feather";
import PropTypes from "prop-types";

function ChoiceBlock({choice, showResult, setShowResult, setIsRight}) {
    const ref = useRef(null)

    const handleDoubleClick = (e) => {
        setShowResult(true);
        setIsRight(choice.rightAnswer);
        if (!choice.rightAnswer) {
            ref.current.style.animation = null;
            ref.current.style.animation = 'shake .2s ease';
        }
    }

    useEffect(() => {

    }, [showResult]);

    return (
        <div ref={ref}
             className={
                `choice-block 
                ${showResult ? "show-result" : ""} 
                ${choice.rightAnswer ? "right-answer" : ""}`}
             onDoubleClick={handleDoubleClick}
        >
            <div className="choice-text">
                <p>{choice.title}</p>
                <p>{choice.subtitle}</p>
            </div>
            <span className={`choice-result`}>
                {choice.rightAnswer ? <Check /> : <X />}
            </span>
        </div>
    );
}

ChoiceBlock.propTypes = {
    choice: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        subtitle: PropTypes.string,
        rightAnswer: PropTypes.bool,
    })),
    showResult: PropTypes.bool,
    setShowResult: PropTypes.func,
    setIsRight: PropTypes.func
}

export default ChoiceBlock;
import React, {useEffect, useRef, useState} from 'react';

import './style.scss'
import {Check, X} from "react-feather";
import PropTypes from "prop-types";

function ChoiceBlock({title, subtitle, isRightAnswer, showResult, setShowResult, setIsRight}) {
    const ref = useRef(null)

    const handleDoubleClick = (e) => {
        setShowResult(true);
        setIsRight(isRightAnswer);
        if (!isRightAnswer) {
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
                ${isRightAnswer ? "right-answer" : ""}`}
             onDoubleClick={handleDoubleClick}
        >
            <div className="choice-text">
                <p>{title}</p>
                <p>{subtitle}</p>
            </div>
            <span className={`choice-result`}>
                {isRightAnswer ? <Check /> : <X />}
            </span>
        </div>
    );
}

ChoiceBlock.propTypes = {
    choice: PropTypes.shape({
        title: PropTypes.string,
        subtitle: PropTypes.string,
        rightAnswer: PropTypes.bool,
    }),
    showResult: PropTypes.bool,
    setShowResult: PropTypes.func,
    setIsRight: PropTypes.func
}

export default ChoiceBlock;
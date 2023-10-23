import React, {useEffect, useRef, useState} from 'react';

import './style.scss'
import {Check, X} from "react-feather";

function ChoiceBlock({choice, showResult, setShowResult}) {
    const ref = useRef(null)

    const handleDoubleClick = (e) => {
        setShowResult(true)
        if (!choice.rightAnswer) {
            ref.current.style.animation = null
            ref.current.style.animation = 'shake .2s ease'
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
                <p>{choice.name}</p>
                <p>{choice.scientifiqueName}</p>
            </div>
            <span className={`choice-result`}>
                {choice.rightAnswer ? <Check /> : <X />}
            </span>
        </div>
    );
}

export default ChoiceBlock;
import "./style.scss"
import PropTypes from "prop-types";
import Button from "../../Buttons/Button.jsx";
import classNames from "classnames";
import {useEffect, useState} from "react";


function Selector({
  choices,
  choiceType,
  multiChoice = false,
  setValue
}) {
  const [currentChoice, setCurrentChoice] = useState(null)
  const [confirmChoice, setConfirmChoice] = useState(false)

  useEffect(() => {
    console.log(choices)
    if (!confirmChoice) {
      console.log("coucou")
      setValue(prev => null)
      setCurrentChoice(prev => null)
    }
  }, [confirmChoice]);

  useEffect(() => {
    console.log(currentChoice)
  }, [currentChoice]);

  const handleConfirmButtonClick = () => {
    if (currentChoice !== null) {
      setValue(prev => currentChoice)
      setConfirmChoice(prev => true)
    }
  }

  return (
    <div className="selector-container">
      {currentChoice === null || !confirmChoice ? <>
        <div className={classNames("choices-container", {grid: choiceType === "img"})}>
          {choices?.map((choice, index) => {
            if (choiceType === "text") {
              return <div className="select-text" key={choice} onClick={() => setCurrentChoice(prev => choice)}>
                <p>{choice}</p>
              </div>
            } else if (choiceType === "img") {
              return <div className={classNames("select-img", {selected: choice === currentChoice})} key={choice} onClick={() => setCurrentChoice(prev => choice)}>
                <img src={choice} alt="image"/>
                <span></span>
              </div>
            }
          })}
        </div>
        <div className="selector-buttons">
          <Button
            label="Confirmer"
            color="primary"
            variant="solid"
            size="big"
            disabled={currentChoice === null}
            onClick={handleConfirmButtonClick}
          />
        </div>

      </> : <>

        <div className={classNames({grid: choiceType === "img"})}>
          <div className={`select-${choiceType} selected`}>
            {choiceType === "text" ? <p>{currentChoice}</p> : <img src={currentChoice} alt={currentChoice} />}
          </div>
        </div>
        <div className="selector-buttons">
          <Button
            label="Rechoisir"
            color="secondary"
            variant="soft"
            size="big"
            disabled={!currentChoice}
            onClick={() => setConfirmChoice(false)}
          />
        </div>
      </>}
    </div>
  );
}

Selector.propTypes = {
  choices: PropTypes.array,
  choiceType: PropTypes.oneOf(['text', 'img']),
  multiChoice: PropTypes.bool,
  setValue: PropTypes.func
}

function SelectorChoice () {

}

export default Selector;
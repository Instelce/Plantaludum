import "./Selector.scss";
import Button from "../../Atoms/Buttons/Button";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Check, RefreshCcw } from "react-feather";

type SelectorProps = {
  inputId?: string;
  choices: string[];
  choiceType: "text" | "img";
  multipleChoice?: boolean;
  defaultValue?: string;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
};

function Selector({
  inputId,
  choices,
  choiceType,
  defaultValue,
  setValue,
}: SelectorProps) {
  const [currentChoice, setCurrentChoice] = useState<string | null>(null);
  const [confirmChoice, setConfirmChoice] = useState(false);

  useEffect(() => {
    console.log(choices);
    if (!confirmChoice) {
      setValue?.(() => null);
      setCurrentChoice(() => null);
    }
  }, [choices, confirmChoice, setValue]);

  useEffect(() => {
    if (defaultValue) {
      setCurrentChoice(() => defaultValue);
      setConfirmChoice(true);
    }
  }, []);

  const handleConfirmButtonClick = (e) => {
    e.preventDefault();
    if (currentChoice !== null) {
      setValue?.(() => currentChoice);
      setConfirmChoice(() => true);
    }
  };

  return (
    <div className="selector-container">
      {currentChoice === null || !confirmChoice ? (
        <>
          <div
            className={classNames("choices-container", {
              grid: choiceType === "img",
            })}
          >
            {choices?.map((choice, index) => {
              if (choiceType === "text") {
                return (
                  <div
                    className="select-text"
                    key={index}
                    onClick={() => setCurrentChoice(() => choice)}
                  >
                    <p>{choice}</p>
                  </div>
                );
              } else if (choiceType === "img") {
                return (
                  <div
                    className={classNames("select-img", {
                      selected: choice === currentChoice,
                    })}
                    key={choice}
                    onClick={() => setCurrentChoice(() => choice)}
                  >
                    <img src={choice} alt="image" />
                    <span></span>
                  </div>
                );
              }
            })}
          </div>

          <div className="selector-buttons">
            <Button
              type="button"
              label="Confirmer la photo"
              color="primary"
              size="medium"
              className="sb"
              disabled={currentChoice === null}
              onClick={handleConfirmButtonClick}
            >
              Confirmer la photo
              <Check />
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className={classNames({ grid: choiceType === "img" })}>
            <div className={`select-${choiceType} selected`}>
              {choiceType === "text" ? (
                <p>{currentChoice}</p>
              ) : (
                <img src={currentChoice} alt={currentChoice} />
              )}
              <input
                id={inputId}
                name={inputId}
                className="hidden"
                value={currentChoice}
                readOnly={true}
              />
            </div>
          </div>

          <div className="selector-buttons">
            <Button
              label="Rechoisir"
              color="gray"
              size="medium"
              className="sb"
              disabled={!currentChoice}
              onClick={() => setConfirmChoice(false)}
            >
              Rechoisir
              <RefreshCcw />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Selector;

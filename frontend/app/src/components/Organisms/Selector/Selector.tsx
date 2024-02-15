import "./Selector.scss";
import Button from "../../Atoms/Buttons/Button";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Check, RefreshCcw } from "react-feather";
import {AsyncImage} from "../../Atoms/Image/Image";

type SelectorProps = {
  inputId?: string;
  choices: string[];
  choiceType: "text" | "img";
  multipleChoice?: boolean;
  defaultValue?: string;
  resetChoice: () => void;
  // eslint-disable-next-line no-unused-vars
  setValue: (value: string | null) => void;
};

function Selector({
  inputId,
  choices,
  choiceType,
  defaultValue,
  setValue,
  resetChoice,
}: SelectorProps) {
  const [currentChoice, setCurrentChoice] = useState<string | null>(null);
  const [confirmChoice, setConfirmChoice] = useState(false);

  useEffect(() => {
    console.log(choices);
    if (!confirmChoice) {
      setValue?.(null);
      setCurrentChoice(() => null);
    }
  }, [choices, confirmChoice, setValue]);

  useEffect(() => {
    if (defaultValue) {
      setCurrentChoice(() => defaultValue);
      setConfirmChoice(true);
    }
  }, []);

  const handleConfirmButtonClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (currentChoice !== null) {
      setValue?.(currentChoice);
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
                    <AsyncImage src={choice} alt="Image" isAbsolute />
                    <span></span>
                  </div>
                );
              }
            })}
          </div>

          {choices.length > 0 && (
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
          )}
        </>
      ) : (
        <>
          <div className={classNames({ grid: choiceType === "img" })}>
            <div className={`select-${choiceType} selected`}>
              {choiceType === "text" ? (
                <p>{currentChoice}</p>
              ) : (
                <AsyncImage src={currentChoice} alt={currentChoice} isAbsolute />
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
              type="button"
              disabled={!currentChoice}
              onClick={() => {
                setConfirmChoice(false);
                resetChoice();
              }}
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

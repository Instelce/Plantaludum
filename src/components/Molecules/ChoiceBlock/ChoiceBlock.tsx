import React, {
  ButtonHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";

import "./ChoiceBlock.scss";
import { Check, X } from "react-feather";
import Button from "../../Atoms/Buttons/Button";

type ChoiceBlockProps = {
  title: string;
  subtitle: string;
  isRightAnswer: boolean;
  showResult: boolean;
  setShowResult: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRight?: React.Dispatch<React.SetStateAction<boolean>>;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function ChoiceBlock({
  title,
  subtitle,
  isRightAnswer,
  showResult,
  setShowResult,
  setIsRight,
}: ChoiceBlockProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isClicked, setIsClicked] = useState(false);

  const handleDoubleClick = () => {
    setShowResult(true);
    setIsRight?.(isRightAnswer);
    setIsClicked(true);

    // shake animation
    /*if (!isRightAnswer && ref.current) {
      ref.current.style.animation = "";
      ref.current.style.animation = "shake .2s ease";
    }*/
  };

  useEffect(() => {
    if (isClicked) {
      setTimeout(() => {
        setIsClicked(false);
      }, 1000);
    }
  }, [isClicked]);

  return (
    <Button
      color="gray"
      ref={ref}
      className={`choice-block
            ${showResult || isClicked ? "show-result" : ""} 
            ${isRightAnswer ? "right-answer" : ""}`}
      onDoubleClick={handleDoubleClick}
      fill
    >
      <div className="choice-text">
        <p>{title}</p>
        <p>{subtitle}</p>
      </div>
      <span className={`choice-result`}>
        {isRightAnswer ? <Check /> : <X />}
      </span>
    </Button>
  );
}

export default ChoiceBlock;

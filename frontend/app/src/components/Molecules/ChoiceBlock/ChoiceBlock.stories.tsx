import "./ChoiceBlock";
import ChoiceBlock from "./ChoiceBlock";
import { useEffect, useState } from "react";

export default {
  title: "Molecules/ChoiceBlock",
  component: ChoiceBlock,
  parameters: {},
  argTypes: {
    onDoubleClick: { action: "showResult" },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    title: "Choice",
    subtitle: "Subtitle",
    isRightAnswer: false,
    showResult: false,
  },
};

export const MultipleChoice = () => {
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (showResult) {
      setTimeout(() => {
        setShowResult(false);
      }, 2000);
    }
  }, [showResult]);

  return (
    <>
      <ChoiceBlock
        title="Mauve Royale"
        subtitle="Malva dendromorpha"
        isRightAnswer={true}
        showResult={showResult}
        setShowResult={setShowResult}
      />
      <ChoiceBlock
        title="Mauve multiflore"
        subtitle="Malva linnaei"
        isRightAnswer={false}
        showResult={showResult}
        setShowResult={setShowResult}
      />
      <ChoiceBlock
        title="Mauve maritime"
        subtitle="Malva wigandii"
        isRightAnswer={false}
        showResult={showResult}
        setShowResult={setShowResult}
      />
      <ChoiceBlock
        title="Mauve de Durieu"
        subtitle="Malva durieui"
        isRightAnswer={false}
        showResult={showResult}
        setShowResult={setShowResult}
      />
    </>
  );
};

import "./ChoiceBlock";
import ChoiceBlock from "./ChoiceBlock";

export default {
  title: "Components/ChoiceBlock",
  component: ChoiceBlock,
  parameters: {},
  argTypes: {
    onDoubleClick: { action: "showResult" },
  },
  tags: ["autodocs"],
};

export const Right = {
  args: {
    choice: {
      title: "Title",
      subtitle: "Sub",
      rightAnswer: true,
    },
    showResult: false,
  },
};

export const Wrong = {
  args: {
    choice: {
      title: "Title",
      subtitle: "Sub",
      rightAnswer: false,
    },
    showResult: false,
  },
};

// Checkbox.stories.js

import Checkbox from "./index.jsx";

export default {
  title: "Components/Forms/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    label: "Arranger par couleur",
    disabled: false,
    value: false,
    handleValueChange: () => false,
  },
};

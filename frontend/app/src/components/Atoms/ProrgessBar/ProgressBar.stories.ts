// .stories.js

import ProgressBar from "./ProgressBar";

export default {
  title: "Atoms/ProgressBar",
  component: ProgressBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    value: 10,
    color: "#fff",
    shape: "rounded",
    thickness: "medium",
  },
};

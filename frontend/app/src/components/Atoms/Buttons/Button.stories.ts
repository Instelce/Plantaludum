// ButtonTest.stories.js

import Button from "./Button";

export default {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "default",
    },
  },
  tags: ["autodocs"],
};

export const Primary = {
  args: {
    label: "Click",
    color: "primary",
    size: "large",
    disabled: false,
    fill: false,
    children: "Button",
  },
};

export const Warning = {
  args: {
    ...Primary.args,
    label: "Delete",
    color: "danger",
  },
};

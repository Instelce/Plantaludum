// Input.stories.js

import Input from "./Input";

export default {
  title: "Atoms/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    // (Story) => {
    //   <Component />;
    // },
  ],
};

export const Default = {
  args: {
    label: "Input",
    value: "",
    type: "text",
    size: "lg",
    showInfo: false,
    disabled: false,
  },
};

export const Email = {
  args: {
    ...Default.args,
    label: "Email",
    value: "",
    showInfo: true,
    type: "email",
  },
};

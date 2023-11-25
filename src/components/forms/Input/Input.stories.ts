// Input.stories.js

import Input from "./index.jsx";
import { useArgs } from "@storybook/preview-api";

/*function Component(Story, ctx) {
  const [, setArgs] = useArgs();

  const handleValueChange = (value) => {
    ctx.args.handleValueChange?.(value);
    setArgs({ value });

    if (ctx.args.value !== undefined) {
      setArgs({ value });
    }
  };

  return <Story args={{ ...ctx.args, handleValueChange }} />;
}*/

export default {
  title: "Components/Forms/Input",
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

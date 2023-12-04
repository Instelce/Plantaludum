import PasswordChecker from "./PasswordChecker";

export default {
  title: "Molecules/PasswordChecker",
  component: PasswordChecker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    password: "azerty",
  },
};

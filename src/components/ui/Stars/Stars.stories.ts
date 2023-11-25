// Stars.stories.js

import Stars from "./index";

export default {
  title: "Components/Stars",
  component: Stars,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    count: 2,
  },
};

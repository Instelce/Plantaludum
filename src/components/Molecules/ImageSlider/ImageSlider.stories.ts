// ImageSlider.stories.js

import ImageSlider from "./index";

export default {
  title: "Components/ImageSlider",
  component: ImageSlider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    images: [
      "https://images.unsplash.com/photo-1670788050449-32d3139a34c5?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDExfEpwZzZLaWRsLUhrfHxlbnwwfHx8fHw%3D",
      "https://images.unsplash.com/photo-1697638332466-16f48f835b96?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDh8SnBnNktpZGwtSGt8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1697273300766-5bbaa53ec2f0?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM1fEpwZzZLaWRsLUhrfHxlbnwwfHx8fHw%3D",
    ],
  },
};

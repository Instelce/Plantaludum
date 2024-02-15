import Stars from "./Stars";
import Flower from "../Icons";

export default {
  title: "Atoms/Stars",
  component: Stars,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    count: 1,
  },
};

export const OtherIcon = () => {
  return (
    <>
      <Stars count={2} icon={<Flower />} />
    </>
  );
};

import Checkbox from "./Checkbox";

export default {
  title: "Atoms/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export const Default = () => {
  return (
    <>
      <Checkbox label="Toggle me" takeValue={true} />
    </>
  );
};

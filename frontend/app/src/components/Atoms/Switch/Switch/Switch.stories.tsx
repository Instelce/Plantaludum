import Switch from "./Switch";

export default {
  title: "Atoms/Switch",
  component: Switch,
  tags: ["autodocs"],
};

export const Default = () => {
  return (
    <>
      <Switch label="switch" takeValue="true" />
    </>
  );
};

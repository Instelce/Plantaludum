import "./ManageDeckButton.scss";
import ManageDeckButton from "./ManageDeckButton";

export default {
  title: "ManageDeckButton",
  component: ManageDeckButton,
  parameters: {},
  argTypes: {},
  tags: ["autodocs"],
};

export const Default = () => {
  return (
    <>
      <ManageDeckButton
        deck={{ name: "Nom du deck", description: "Lorem ipsum" }}
      />
    </>
  );
};

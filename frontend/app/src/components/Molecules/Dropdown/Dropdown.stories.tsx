import Dropdown from "./Dropdown";
import "./Dropdown.scss";
import Option from "../../Atoms/Option/Option";

export default {
  title: "Molecules/Dropdown",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export const Default = () => {
  return (
    <>
      <Dropdown label="Fruits">
        <Option>Banane</Option>
        <Option>Orange</Option>
        <Option>Pomme</Option>
        <Option>Raisin</Option>
      </Dropdown>
    </>
  );
};

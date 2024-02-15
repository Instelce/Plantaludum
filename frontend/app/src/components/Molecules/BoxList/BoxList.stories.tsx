import "./BoxList.scss";
import BoxList from "./BoxList";

export default {
  title: "Molecules/BoxListGroup",
  component: BoxList.Group,
  parameters: {},
  argTypes: {},
  tags: ["autodocs"],
};

export const SimpleBoxListGroup = () => {
  return (
    <>
      <BoxList.Group size="large" rounded={true}>
        <BoxList.Item>Verveine</BoxList.Item>
        <BoxList.Item>Coquelicot</BoxList.Item>
        <BoxList.Item>Millepertuis</BoxList.Item>
        <BoxList.Item>Mauve</BoxList.Item>
      </BoxList.Group>
    </>
  );
};

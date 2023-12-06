import "./Header.scss";
import Header from "./Header";
import Button from "../../Atoms/Buttons/Button";

export default {
  title: "Molecules/Header",
  component: Header,
  parameters: {},
  argTypes: {},
  tags: ["autodocs"],
};

export const Default = () => {
  return (
    <>
      <Header.Root type={"page"}>
        <Header.Title>Super</Header.Title>
        <Header.Right>
          <Button>Button</Button>
        </Header.Right>
      </Header.Root>
    </>
  );
};

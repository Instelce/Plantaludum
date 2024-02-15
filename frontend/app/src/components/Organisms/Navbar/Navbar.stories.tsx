import Navbar from "./Navbar";
import Button from "../../Atoms/Buttons/Button";

export default {
  title: "Organisms/Navbar",
};

export const Default = () => {
  return (
    <>
      <Navbar.Root>
        <Navbar.Left>
          <a href="#">Mon jardin</a>
          <a href="#">Explorer</a>
        </Navbar.Left>
        <Navbar.Right>
          <Button color="gray">Nouveau deck</Button>
        </Navbar.Right>
      </Navbar.Root>
    </>
  );
};

import Navbar from "./Navbar";
import Button from "../../Atoms/Buttons/Button";

export default {
  title: "Organisms/Navbar",
};

export const Default = () => {
  return (
    <>
      <Navbar>
        <div className="left">
          <a href="#">Mon jardin</a>
          <a href="#">Explorer</a>
        </div>
        <div className="right">
          <Button color="gray">Nouveau deck</Button>
        </div>
      </Navbar>
    </>
  );
};

import Button from "../components/Atoms/Buttons/Button.jsx";
import {Settings} from "react-feather";
import Navbar from "../components/Organisms/Navbar/Navbar";
import {Link} from "react-router-dom";

function Test(props) {
  return (
    <>
      <Navbar>
        <div className="left">
          <Link to="/explorer">Explorer</Link>
          <Link to="/mon-jardin">Mon jardin</Link>
        </div>
        <div className="right">
          <Button label="Nouveau Deck" color="gray" />
        </div>
        nope
      </Navbar>
      <p>coucou</p>
      <Button label="Go" color="primary" />
      <Button icon={<Settings />} color="gray" />
      <Button color="gray">
        <div style={{ display: "flex", flexDirection: "column" }}>
          Super
          <span>cool</span>
        </div>
      </Button>
    </>
  );
}

export default Test;

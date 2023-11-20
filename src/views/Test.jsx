import Button from "../components/Buttons/Button.jsx";
import {Settings} from "react-feather";
import Navbar from "../components/Navbar/index.jsx";
import ButtonLink from "../components/Buttons/ButtonLink.jsx";
import {Link} from "react-router-dom";

function Test(props) {
  return (
    <>
      <Navbar>
        <div className="left">
          <a href="#">Explorer</a>
          <a href="#">Mon jardin</a>
        </div>
        <div className="right">
          <Button
            label="Nouveau Deck"
            color="gray"
          />
        </div>
        nope
      </Navbar>
      <p>coucou</p>
      <Button
        label="Go"
        color="primary"
      />
      <Button
        icon={<Settings />}
        color="gray"
        />
    </>
  );
}

export default Test;
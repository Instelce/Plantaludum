import React, { useMemo, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import Input from "../components/forms/Input/index.jsx";
import Button from "../components/Buttons/Button.jsx";
import PropTypes from "prop-types";
import ButtonLink from "../components/Buttons/ButtonLink.jsx";

function Login({ handleLogin }) {
  const [passwordValue, setPasswordValue] = useState("");
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handle");

    // check if user exist ...
    // token ...

    // then
    handleLogin({
      id: 1,
      name: "Franklin",
    });
    navigate('/menu')
  };

  return (
    <div className="container center">
      <form className="form-page" onSubmit={handleSubmit}>
        <div className="form-header">
          <h1>Content de te revoir !</h1>
          <p>
            Si tu n’as pas de compte, inscrit toi{" "}
            <Link to="/inscription" className="link">
              ici
            </Link>
            .
          </p>
        </div>
        <Input label="Email" type="email" showInfo size="big"/>
        <Input
          label="Mot de passe"
          type="password"
          showInfo
          size="big"
          value={passwordValue}
          handleValueChange={setPasswordValue}
        />
        <Button
            label="Connexion"
          type="submit"
          color="primary"
          size="big"
        />
      </form>
    </div>
  );
}

Login.propTypes = {
  handleLogin: PropTypes.func,
};

export default Login;

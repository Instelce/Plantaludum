import React, { useMemo, useState } from "react";
import { styled } from "styled-components";
import { Link } from "react-router-dom";
import Input from "../components/forms/Input/index.jsx";
import Button from "../components/Buttons/Button.jsx";
import PasswordChecker from "../components/forms/PasswordChecker/index.jsx";
import ButtonLink from "../components/Buttons/ButtonLink.jsx";

function Register(props) {
  const [passwordValue, setPasswordValue] = useState("");

  return (
    <div className="container center">
      <form className="form-page">
        <div className="form-header">
          <h1>Bienvenu</h1>
          <p>
            Créer toi un compte pour pouvoir continer, ou{" "}
            <Link to="/connexion" className="link">connecte</Link> toi si tu en a déjà un.
          </p>
        </div>
        <Input label="Nom" type="text" showInfo/>
        <Input label="Email" type="email" showInfo/>
        <Input
          label="Mot de passe"
          type="password"
          showInfo
          value={passwordValue}
          handleValueChange={setPasswordValue}
        />
        <Input label="Confirmation du mot de passe" type="password" showInfo/>
        <PasswordChecker password={passwordValue} />
        <ButtonLink to="/connexion" label="Créer" color="primary" size="big" fill={true} />
      </form>
    </div>
  );
}

export default Register;

import React, {useMemo, useRef, useState} from "react";
import { styled } from "styled-components";
import {Link, Navigate, redirect} from "react-router-dom";
import Input from "../components/forms/Input/index.jsx";
import Button from "../components/Buttons/Button.jsx";
import PasswordChecker from "../components/forms/PasswordChecker/index.jsx";
import ButtonLink from "../components/Buttons/ButtonLink.jsx";
import defaultFetch from "../api/axios.js";

function Register(props) {
  const [passwordValue, setPasswordValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault()
    let formData = new FormData(e.target)

    defaultFetch.post('/register', {
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      password_confirmation: formData.get('password_confirmation')
    }).then(response => {
      if (response.status === 201) {
        console.log(response.status)
        return redirect('/connexion')
      }
      e.target.reset()
    })
  }

  return (
    <div className="container center">
      <form className="form-page" onSubmit={handleSubmit}>
        <div className="form-header">
          <h1>Bienvenu</h1>
          <p>
            Créer toi un compte pour pouvoir continer, ou{" "}
            <Link to="/connexion" className="link">connecte</Link> toi si tu en a déjà un.
          </p>
        </div>
        <Input id="username" label="Nom" type="text" showInfo/>
        <Input id="email" label="Email" type="email" showInfo/>
        <Input
          id="password"
          label="Mot de passe"
          type="password"
          showInfo
          value={passwordValue}
          handleValueChange={setPasswordValue}
        />
        <Input id="password_confirmation" label="Confirmation du mot de passe" type="password" showInfo/>
        <PasswordChecker password={passwordValue} />
        <Button label="Créer" type="submit" color="primary" size="big" fill={true} />
      </form>
    </div>
  );
}

export default Register;

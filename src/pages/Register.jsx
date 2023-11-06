import React, {useMemo, useRef, useState} from "react";
import { styled } from "styled-components";
import {Link, Navigate, redirect, useNavigate} from "react-router-dom";
import Input from "../components/forms/Input/index.jsx";
import Button from "../components/Buttons/Button.jsx";
import PasswordChecker from "../components/forms/PasswordChecker/index.jsx";
import ButtonLink from "../components/Buttons/ButtonLink.jsx";
import defaultFetch from "../api/axios.js";
import useFormFilled from "../hooks/useFormFilled.js";


function Register(props) {
  const navigate = useNavigate()
  const [responseHelper, setResponseHelper] = useState({})
  const [passwordValue, setPasswordValue] = useState("");
  const {formRef, handleFormChange, isFilled} = useFormFilled()

  const handleSubmit = (e) => {
    e.preventDefault()
    let formData = new FormData(e.target)
    console.log(formData.get('username'))

    defaultFetch.post('/auth/register', {
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      password_confirmation: formData.get('password_confirmation')
    })
      .then(response => {
        if (response.status === 201) {
          console.log(response.data)
          setTimeout(() => {
            navigate('/connexion', {replace: true})
          }, 2000)
        }
      })
      .catch(error => {
        console.log(error.response.data)
        setResponseHelper(error.response.data)
      })
  }

  return (
    <div className="container center">
      <form ref={formRef} className="form-page" onSubmit={handleSubmit} onChange={(e) => handleFormChange(e.target)}>
        <div className="form-header">
          <h1>Bienvenu</h1>
          <p>
            Créer toi un compte pour pouvoir continer, ou{" "}
            <Link to="/connexion" className="link">
              connecte
            </Link>{" "}
            toi si tu en a déjà un.
          </p>
        </div>
        <Input
          id="username"
          label="Nom"
          size="big"
          type="text"
          showInfo
          helperText={responseHelper?.username}
        />
        <Input
          id="email"
          label="Email"
          size="big"
          type="email"
          showInfo
          helperText={responseHelper?.email}
        />
        <Input
          id="password"
          label="Mot de passe"
          type="password"
          size="big"
          showInfo
          value={passwordValue}
          handleValueChange={setPasswordValue}
          helperText={responseHelper?.password?.[0]}
        />
        <Input
          id="password_confirmation"
          label="Confirmation du mot de passe"
          size="big"
          type="password"
          showInfo
          helperText={responseHelper?.password_confirmation}
        />
        <PasswordChecker password={passwordValue} />
        <Button label="Créer" type="submit" color="primary" size="big" fill disabled={!isFilled} />
      </form>
    </div>
  );
}

export default Register;

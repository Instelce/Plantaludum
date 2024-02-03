import React, { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Atoms/Input/Input";
import Button from "../components/Atoms/Buttons/Button.jsx";
import PasswordChecker from "../components/Molecules/PasswordChecker/PasswordChecker";
import useFormFilled from "../hooks/useFormFilled.js";
import { useMutation } from "@tanstack/react-query";
import { auth } from "../services/api";
import {
  HelperRegisterType,
  RegisterFormDataType,
} from "../services/api/types/users";
import { AxiosError } from "axios";
import Navbar from "../components/Organisms/Navbar/Navbar";
import { ArrowRight } from "react-feather";
import Header from "../components/Molecules/Header/Header";

function Register() {
  const navigate = useNavigate();
  const [responseHelper, setResponseHelper] = useState<HelperRegisterType>({});
  const [passwordValue, setPasswordValue] = useState("");
  const { formRef, handleFormChange, isFilled } = useFormFilled();

  const { isPending, mutate: mutateRegister } = useMutation({
    mutationKey: ["register"],
    mutationFn: (data: RegisterFormDataType) => auth.register(data),
    onSuccess: () => {
      setTimeout(() => {
        navigate("/connexion", { replace: true });
      }, 2000);
    },
    onError: (error: AxiosError) => {
      setResponseHelper(error.response?.data || {});
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    let formData = new FormData(e.target as HTMLFormElement);

    mutateRegister({
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      password_confirmation: formData.get("password_confirmation") as string,
    });
  };

  return (
    <>
      <Header.Root type="page" center>
        <Header.Title>Inscription</Header.Title>
      </Header.Root>

      <div className="form-page">
        <form ref={formRef} onSubmit={handleSubmit} onChange={handleFormChange}>
          <Input
            id="username"
            label="Nom"
            type="text"
            showInfo
            helperText={responseHelper?.username}
          />
          <Input
            id="email"
            label="Email"
            type="email"
            showInfo
            helperText={responseHelper?.email}
          />
          <Input
            id="password"
            label="Mot de passe"
            type="password"
            showInfo
            value={passwordValue}
            handleValueChange={setPasswordValue}
            helperText={responseHelper?.password?.[0]}
          />
          <Input
            id="password_confirmation"
            label="Confirmation du mot de passe"
            type="password"
            showInfo
            helperText={responseHelper?.password_confirmation}
          />
          <PasswordChecker password={passwordValue} />
          <Button
            label="Créer"
            type="submit"
            color="primary"
            size="large"
            fill
            disabled={!isFilled}
            loading={isPending}
            className="sb"
          >
            Créer
            <ArrowRight />
          </Button>
          <footer>
            <p>
              Créer toi un compte pour pouvoir continer, ou{" "}
              <Link to="/connexion" className="link">
                connecte
              </Link>{" "}
              toi si tu en a déjà un.
            </p>
          </footer>
        </form>
      </div>
    </>
  );
}

export default Register;

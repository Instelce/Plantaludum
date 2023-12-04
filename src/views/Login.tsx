import React, { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Input from "../components/Atoms/Input/Input";
import Button from "../components/Atoms/Buttons/Button.jsx";
import useFormFilled from "../hooks/useFormFilled.js";
import { useMutation } from "@tanstack/react-query";
import { auth } from "../services/api";
import Navbar from "../components/Organisms/Navbar/Navbar";
import { ArrowRight } from "react-feather";
import { useAuth } from "../context/AuthProvider";
import {
  HelperLoginType,
  LoginFormDataType,
} from "../services/api/types/users";
import { AxiosError, AxiosResponse } from "axios";
import Checkbox from "../components/Atoms/Checkbox/Checkbox";
import { useNotification } from "../context/NotificationsProvider";

function Login() {
  const { setAccessToken, setCSRFToken, persist, setPersist } = useAuth();
  const [passwordValue, setPasswordValue] = useState("");
  const [responseHelper, setResponseHelper] = useState<HelperLoginType>({});
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location?.state?.from?.pathname || "/mon-jardin";
  const [loading, setLoading] = useState(false);
  const { formRef, handleFormChange, isFilled } = useFormFilled();
  const notification = useNotification();

  const { isPending, mutate: mutateLogin } = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LoginFormDataType) => auth.login(data),
    onSuccess: (response: AxiosResponse) => {
      setAccessToken(response.data?.access_token);
      setCSRFToken(response.headers["x-csrftoken"]);
      setLoading(false);

      navigate(fromLocation, { replace: true });
      notification.success({ message: "Connexion réussie" });
    },
    onError: (error: AxiosError) => {
      setResponseHelper(error?.response.data);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    mutateLogin({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
  };

  const togglePersist = () => {
    setPersist(() => !persist);
    localStorage.setItem("persist", JSON.stringify(!persist));
  };

  return (
    <>
      <Navbar>
        <div className="left">
          <Link to="/explorer">Explorer</Link>
        </div>
        <div className="right">
          <Button asChild label="Inscription" size="large" color="gray">
            <Link
              to="/inscription"
              state={{ from: { pathname: location.pathname } }}
            >
              S'inscrire
            </Link>
          </Button>
        </div>
      </Navbar>

      <header className="page-header center">
        <h1>Connexion</h1>
      </header>

      <div className="form-page">
        <form ref={formRef} onSubmit={handleSubmit} onChange={handleFormChange}>
          <Input
            id="email"
            label="Email"
            type="email"
            size="large"
            showInfo
            helperText={responseHelper?.email}
          />
          <Input
            id="password"
            label="Mot de passe"
            type="password"
            showInfo
            size="large"
            value={passwordValue}
            handleValueChange={setPasswordValue}
            helperText={responseHelper?.password}
          />
          <Checkbox
            label="Se souvenir de moi"
            takeValue="true"
            value={persist}
            handleValueChange={togglePersist}
            data-not-count
          />
          <p style={{ marginBottom: "1rem" }}>{responseHelper?.detail}</p>

          <Button
            className="sb"
            type="submit"
            color="primary"
            size="large"
            disabled={!isFilled}
            loading={isPending}
          >
            Goo
            <ArrowRight />
          </Button>

          <footer>
            <p>
              Si tu n’as pas de compte, inscrit toi{" "}
              <Link to="/inscription" className="link">
                ici
              </Link>
              .
            </p>
          </footer>
        </form>
      </div>
    </>
  );
}

export default Login;

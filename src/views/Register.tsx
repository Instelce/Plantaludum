import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/forms/Input/Input";
import Button from "../components/ui/Buttons/Button.jsx";
import PasswordChecker from "../components/forms/PasswordChecker/PasswordChecker";
import useFormFilled from "../hooks/useFormFilled.js";
import { useMutation } from "@tanstack/react-query";
import { auth } from "../services/api";
import {
  HelperRegisterType,
  RegisterFormDataType,
} from "../services/api/types/users";
import { AxiosError } from "axios";

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
      setResponseHelper(error.response.data);
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
    <div className="container center">
      <form
        ref={formRef}
        className="form-page"
        onSubmit={handleSubmit}
        onChange={handleFormChange}
      >
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
        <Button
          label="Créer"
          type="submit"
          color="primary"
          size="big"
          fill
          disabled={!isFilled}
          loading={isPending}
        />
      </form>
    </div>
  );
}

export default Register;

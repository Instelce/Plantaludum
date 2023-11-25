import { useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Input from "../components/forms/Input/index.jsx";
import Button from "../components/ui/Buttons/Button.jsx";
import useAuth from "../hooks/auth/useAuth.js";
import useFormFilled from "../hooks/useFormFilled.js";
import { useMutation } from "@tanstack/react-query";
import { login } from "../services/api/api.js";
import Navbar from "../components/Navbar/index.jsx";
import { ArrowRight } from "react-feather";

function Login({ handleLogin }) {
  const { setAccessToken, setCSRFToken } = useAuth();
  const [passwordValue, setPasswordValue] = useState("");
  const [responseHelper, setResponseHelper] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location?.state?.from?.pathname || "/mon-jardin";
  const [loading, setLoading] = useState(false);
  const { formRef, handleFormChange, isFilled } = useFormFilled();

  const { isPending, mutate: mutateLogin } = useMutation({
    mutationKey: ["login"],
    mutationFn: (data) => login(data),
    onSuccess: (response) => {
      setAccessToken(response.data?.access_token);
      setCSRFToken(response.headers["x-csrftoken"]);
      setLoading(false);

      navigate(fromLocation, { replace: true });
    },
    onError: (error) => {
      setResponseHelper(error?.response.data);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    mutateLogin({
      email: formData.get("email"),
      password: formData.get("password"),
    });
  };

  return (
    <>
      <Navbar>
        <div className="left">
          <Link to="/explorer">Explorer</Link>
        </div>
      </Navbar>

      <header className="page-header center">
        <h1>Connexion</h1>
      </header>

      <div className="form-page">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          onChange={(e) => handleFormChange(e.target)}
        >
          <Input
            id="email"
            label="Email"
            type="text"
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
          <p style={{ marginBottom: "1rem" }}>{responseHelper?.detail}</p>
          <Button
            label="Goo"
            icon={<ArrowRight />}
            type="submit"
            color="primary"
            size="large"
            disabled={!isFilled}
            loading={isPending}
          />
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

Login.propTypes = {
  handleLogin: PropTypes.func,
};

export default Login;

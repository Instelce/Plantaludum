import {useState} from "react";
import PropTypes from "prop-types";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Input from "../components/forms/Input/index.jsx";
import Button from "../components/Buttons/Button.jsx";
import useAuth from "../hooks/auth/useAuth.js";
import useFormFilled from "../hooks/useFormFilled.js";
import {useMutation} from "@tanstack/react-query";
import {login} from "../api/api.js";

function Login({ handleLogin }) {
  const {setAccessToken, setCSRFToken} = useAuth()
  const [passwordValue, setPasswordValue] = useState("");
  const [responseHelper, setResponseHelper] = useState({})
  const navigate = useNavigate()
  const location = useLocation()
  const fromLocation = location?.state?.from?.pathname || '/menu'
  const [loading, setLoading] = useState(false)
  const {formRef, handleFormChange, isFilled} = useFormFilled()

  const {isPending, mutate: mutateLogin} = useMutation({
    mutationKey: ['login'],
    mutationFn: (data) => login(data),
    onSuccess: (response) => {
      setAccessToken(response.data?.access_token)
      setCSRFToken(response.headers["x-csrftoken"])
      setLoading(false)

      navigate(fromLocation, {replace: true})
    },
    onError: (error) => {
      setResponseHelper(error?.response.data)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target)

    mutateLogin({
      email: formData.get('email'),
      password: formData.get('password')
    })
  }

  return (
    <div className="container center">
      <form ref={formRef} className="form-page" onSubmit={handleSubmit} onChange={(e) => handleFormChange(e.target)}>
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
        <Input
          id="email"
          label="Email"
          type="text"
          size="big"
          showInfo
          helperText={responseHelper?.email}/>
        <Input
          id="password"
          label="Mot de passe"
          type="password"
          showInfo
          size="big"
          value={passwordValue}
          handleValueChange={setPasswordValue}
          helperText={responseHelper?.password}
        />
        <p style={{marginBottom: "1rem"}}>{responseHelper?.detail}</p>
        <Button
          label="Connexion"
          type="submit"
          color="primary"
          size="big"
          disabled={!isFilled}
          loading={isPending}
        />
      </form>
    </div>
  );
}

Login.propTypes = {
  handleLogin: PropTypes.func,
};

export default Login;

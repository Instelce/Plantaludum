import { useEffect } from "react";
import { Link } from "react-router-dom";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch.js";
import useRefreshToken from "../../hooks/auth/useRefreshToken.js";
import useLogout from "../../hooks/auth/useLogout.js";
import useUser from "../../hooks/auth/useUser.js";
import useAuth from "../../hooks/auth/useAuth.js";
import Navbar from "../../components/Navbar/index.jsx";
import ButtonLink from "../../components/ui/Buttons/ButtonLink.jsx";
import { Plus } from "react-feather";

function MainMenu(props) {
  const { user } = useAuth();
  const privateFetch = usePrivateFetch();
  const refresh = useRefreshToken();
  const logout = useLogout();
  const getUser = useUser();

  // set user is first login
  useEffect(() => {
    if (Object.keys(user).length === 0) {
      getUser();
      console.log(user);
    }
  }, []);

  return (
    <>
      <Navbar>
        <div className="left">
          <Link to="/explorer">Explorer</Link>
        </div>
        <div className="right">
          <ButtonLink to="/decks/create" label="Nouveau deck" color="gray" />
        </div>
      </Navbar>

      <header className="page-header">
        <h1>Mon jardin</h1>
      </header>
    </>
  );
}

export default MainMenu;

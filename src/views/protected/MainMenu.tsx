import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch.js";
import useRefreshToken from "../../hooks/auth/useRefreshToken.js";
import useLogout from "../../hooks/auth/useLogout.js";
import useUser from "../../hooks/auth/useUser.js";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../context/AuthProvider";
import Button from "../../components/ui/Buttons/Button";

function MainMenu() {
  const privateFetch = usePrivateFetch();
  const refresh = useRefreshToken();
  const logout = useLogout();
  const user = useUser();

  return (
    <>
      <Navbar>
        <div className="left">
          <Link to="/explorer">Explorer</Link>
        </div>
        <div className="right">
          <Button asChild label="Nouveau deck" size="large" color="gray">
            <Link
              to="/decks/create"
              state={{ from: { pathname: location.pathname } }}
            >
              Nouveau deck
            </Link>
          </Button>
        </div>
      </Navbar>

      <header className="page-header">
        <h1>
          Mon <span className="highlight">jardin</span>
        </h1>
        <p>{user?.username}</p>
      </header>
    </>
  );
}

export default MainMenu;

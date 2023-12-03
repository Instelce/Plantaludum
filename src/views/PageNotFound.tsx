import React from "react";
import Button from "../components/Atoms/Buttons/Button";
import {Link, useNavigate} from "react-router-dom";
import Navbar from "../components/Organisms/Navbar/Navbar";
import {useAuth} from "../context/AuthProvider";

function PageNotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
      <Navbar>
        <div className="left">
          <Link to="/mon-jardin">Mon jardin</Link>
        </div>
        <div className="right">
          {user && (
            <Button asChild label="Nouveau deck" size="large" color="gray">
              <Link
                to="/decks/create"
                state={{ from: { pathname: location.pathname } }}
              >
                Nouveau deck
              </Link>
            </Button>
          )}
        </div>
      </Navbar>

      <header className="page-header">
        Oups cette page n'existe pas...
        <Button onClick={() => navigate(-1)}>Revenir en arrière</Button>
      </header>
    </>
  );
}

export default PageNotFound;

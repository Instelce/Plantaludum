import useUser from "../../hooks/auth/useUser";
import {Link} from "react-router-dom";
import Button from "../../components/ui/Buttons/Button";
import Navbar from "../../components/Navbar/Navbar";
import React from "react";

function Profile() {
  const user = useUser()

  return <div>
    <Navbar>
      <div className="left">
        <Link to="/mon-jardin">Mon jardin</Link>
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
      <h1>Profile</h1>
    </header>

    <main className="content-container">
      {user && <>
        {user.username}
        {user.email}
        {user.level}
      </>}
    </main>
  </div>;
}

export default Profile;

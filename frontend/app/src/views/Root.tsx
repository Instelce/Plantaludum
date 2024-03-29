import { Link, LinkProps, Outlet, useLocation } from "react-router-dom";
import { HelpCircle, LogOut, Maximize2, Minimize2, Settings, User } from "react-feather";
import Button from "../components/Atoms/Buttons/Button";
import useLogout from "../hooks/auth/useLogout";
import { useAuth } from "../context/AuthProvider";
import useUser from "../hooks/auth/useUser";
import Navbar from "../components/Organisms/Navbar/Navbar";
import classNames from "classnames";
import { useState } from "react";

function ButtonsMenu() {
  const logout = useLogout();
  const { accessToken } = useAuth();
  const currentUser = useUser();
  const location = useLocation();

  // if (!accessToken) return null;

  return (
    <div className="buttons-menu">
      <ToggleFullscreenButton />
      <Button
        asChild
        title="Aide"
        color={location.pathname === "/help" ? "gray" : "dark-gray"}
        size="medium"
        onlyIcon
      >
        <Link to="/help">
          <HelpCircle />
        </Link>
      </Button>

      <Button
        asChild
        title="Paramètres"
        color={location.pathname === "/settings" ? "gray" : "dark-gray"}
        size="medium"
        onlyIcon
      >
        <Link to="/settings">
          <Settings />
        </Link>
      </Button>
      {accessToken && (
        <>
          {" "}
          <Button
            asChild
            title="Profil"
            color={
              location.pathname.includes("/profile") ? "gray" : "dark-gray"
            }
            size="medium"
            onlyIcon
          >
            <Link to={`profile/${currentUser?.id}`}>
              <User />
            </Link>
          </Button>
          <Button onlyIcon title="Déconnexion" color="dark-gray" size="medium" onClick={logout}>
            <LogOut />
          </Button>
        </>
      )}
    </div>
  );
}

function Root() {
  const { accessToken } = useAuth();
  const location = useLocation();
  return (
    <>
      <div className="page-container">
        <div className="container">
          <div className="scroller">
            {!(
              location.pathname.includes("game") &&
              !location.pathname.includes("resultat")
            ) && (
              <Navbar.Root>
                <Navbar.Left>
                  {accessToken ? (
                    <>
                      <LocationLink to="/mon-jardin">Mon jardin</LocationLink>
                      <LocationLink to="/identifications">
                        Identifications
                      </LocationLink>
                    </>
                  ) : (
                    <LocationLink to="/">Accueil</LocationLink>
                  )}
                  <LocationLink to="/explorer">Explorer</LocationLink>
                  {(localStorage.getItem("settings.showRankingTab") ? localStorage.getItem("settings.showRankingTab") === "true" : true) &&
                    accessToken && (
                      <LocationLink to="/classement">Classement</LocationLink>
                    )}
                </Navbar.Left>
                <Navbar.Right>
                  {accessToken ? (
                    <Button
                      asChild
                      size="large"
                      color="gray"
                      title="Créer un deck, et partage le !"
                    >
                      <LocationLink to="/decks/create">
                        Créer un deck
                      </LocationLink>
                    </Button>
                  ) : (
                    <>
                      <LocationLink to="/connexion">Connexion</LocationLink>
                      <Button
                        asChild
                        label="Inscription"
                        size="large"
                        color="gray"
                      >
                        <LocationLink to="/inscription">
                          S&apos;inscrire
                        </LocationLink>
                      </Button>
                    </>
                  )}
                </Navbar.Right>
              </Navbar.Root>
            )}

            <Outlet />
          </div>

          <footer>
            <div className="up">
              <div>
                <div className="section">
                  <a href="https://github.com/Instelce/Plantaludum/issues/new?labels=bug">
                    Reporter un bug
                  </a>
                  <a href="https://github.com/Instelce/Plantaludum/issues/new?labels=enhancement">
                    Proposer une fonctionnalité
                  </a>
                </div>

                <div className="section">
                  <a href="https://github.com/Instelce/FloreAPI">FloreAPI</a>
                  <a href="https://github.com/Instelce/Plantaludum">Code source</a>
                </div>
              </div>

              <img src="/logos/logo.svg" alt="Plantaludum logo" />
            </div>

            <div className="down">
              <Link to="/mentions-legales">Mentions légales</Link>
            </div>
          </footer>
        </div>
        <ButtonsMenu />
      </div>
    </>
  );
}

function LocationLink({ ...props }: LinkProps) {
  const location = useLocation();
  return (
    <Link
      className={classNames({
        active: location.pathname === props.to.toString(),
      })}
      {...props}
      state={{ from: { pathname: location.pathname } }}
    />
  );
}

function ToggleFullscreenButton() {
  const [icon, setIcon] = useState(<Maximize2 />);
  return <Button onlyIcon title="Fullscreen" color="dark-gray" size="medium" onClick={() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIcon(<Maximize2 />);
    } else {
      document.documentElement.requestFullscreen();
      setIcon(<Minimize2 />);
    }
  }}>
    {icon}
  </Button>;
}

export default Root;

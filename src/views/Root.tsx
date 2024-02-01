import { Link, Outlet } from "react-router-dom";
import { HelpCircle, LogOut, Settings, User } from "react-feather";
import Button from "../components/Atoms/Buttons/Button";
import useLogout from "../hooks/auth/useLogout";
import { useAuth } from "../context/AuthProvider";
import useUser from "../hooks/auth/useUser";

function ButtonsMenu() {
  const logout = useLogout();
  const { accessToken } = useAuth();
  const currentUser = useUser();

  if (!accessToken) return null;

  return (
    <div className="buttons-menu">
      <Button asChild color="dark-gray" size="medium" onlyIcon>
        <Link to="/help">
          <HelpCircle />
        </Link>
      </Button>

      {accessToken && (
        <>
          {" "}
          <Button asChild color="dark-gray" size="medium" onlyIcon>
            <Link to="/settings">
              <Settings />
            </Link>
          </Button>
          <Button asChild color="dark-gray" size="medium" onlyIcon>
            <Link to={`profile/${currentUser?.id}`}>
              <User />
            </Link>
          </Button>
          <Button onlyIcon color="dark-gray" size="medium" onClick={logout}>
            <LogOut />
          </Button>
        </>
      )}
    </div>
  );
}

function Root() {
  return (
    <>
      <div className="page-container">
        <div className="container">
          <div className="scroller">
            <Outlet />
          </div>
          <footer>© 2024 - Plantaludum Github</footer>
        </div>
        <ButtonsMenu />
      </div>
    </>
  );
}

export default Root;

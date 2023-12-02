import {Link, Outlet} from "react-router-dom";
import {HelpCircle, LogOut, Settings, User} from "react-feather";
import Button from "../components/ui/Buttons/Button";
import useLogout from "../hooks/auth/useLogout";
import {useAuth} from "../context/AuthProvider";

function ButtonsMenu() {
  const logout = useLogout();
  const {accessToken} = useAuth()

  return (
    <div className="buttons-menu">
      <Button asChild color="dark-gray" size="medium" onlyIcon>
        <Link to="">
          <HelpCircle />
        </Link>
      </Button>
      <Button asChild color="dark-gray" size="medium" onlyIcon>
        <Link to="">
          <Settings />
        </Link>
      </Button>
      {accessToken && <> <Button asChild color="dark-gray" size="medium" onlyIcon>
        <Link to="">
          <User />
        </Link>
      </Button>
      <Button color="dark-gray" size="medium" onlyIcon onClick={logout}>
        <LogOut />
      </Button>
      </>}
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
        </div>
        <ButtonsMenu />
      </div>
    </>
  );
}

export default Root;

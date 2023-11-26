import { Link, Outlet } from "react-router-dom";
import { HelpCircle, LogOut, Settings, User } from "react-feather";
import Button from "../components/ui/Buttons/Button";

function ButtonsMenu() {
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
      <Button asChild color="dark-gray" size="medium" onlyIcon>
        <Link to="">
          <User />
        </Link>
      </Button>
      <Button asChild color="dark-gray" size="medium" onlyIcon>
        <Link to="">
          <LogOut />
        </Link>
      </Button>
    </div>
  );
}

function Root(props) {
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

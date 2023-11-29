import { Link, Outlet } from "react-router-dom";
import { HelpCircle, LogOut, Settings, User } from "react-feather";
import Button from "../components/ui/Buttons/Button";
import useLogout from "../hooks/auth/useLogout";
import { useNotification } from "../context/NotificationsProvider";
import Notification from "../components/Notification/Notification";
import { StatusProp } from "../types/helpers";
import { useEffect } from "react";

function ButtonsMenu() {
  const logout = useLogout();

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
      <Button color="dark-gray" size="medium" onlyIcon onClick={logout}>
        <LogOut />
      </Button>
    </div>
  );
}

function Root() {
  const { notifications } = useNotification();

  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

  return (
    <>
      <div className="notifications-container">
        {notifications
          // .filter((notification) => notification.active)
          .map((notification, index: number) => (
            <Notification
              key={index}
              index={index}
              notification={notification}
            />
          ))}
      </div>
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

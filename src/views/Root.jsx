import {Outlet} from "react-router-dom";
import ButtonLink from "../components/Buttons/ButtonLink.jsx";
import {HelpCircle, LogOut, Settings, User} from "react-feather";

function ButtonsMenu() {
    return (
      <div className="buttons-menu">
          <ButtonLink to="/info" icon={<HelpCircle/>} color="dark-gray" size="medium"></ButtonLink>
          <ButtonLink to="/settings" icon={<Settings/>} color="dark-gray" size="medium"></ButtonLink>
          <ButtonLink to="/profile" icon={<User />} color="dark-gray" size="medium"></ButtonLink>
          <ButtonLink to="/logout" icon={<LogOut />} color="dark-gray" size="medium"></ButtonLink>
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
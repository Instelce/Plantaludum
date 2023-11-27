import { Children, isValidElement, PropsWithChildren } from "react";
import "./Navbar.scss";

function Navbar({ children }: PropsWithChildren) {
  const childrenArray = Children.toArray(children);

  const leftElements = childrenArray.filter(
    (child) => isValidElement(child) && child.props.className === "left",
  );

  const rightElements = childrenArray.filter(
    (child) => isValidElement(child) && child.props.className === "right",
  );

  return (
    <div className="navbar">
      <div className="left">
        <img className="logo" src="/public/icon.svg" alt="Plantaludum icon" />

        {leftElements}
      </div>

      {rightElements}
    </div>
  );
}

export default Navbar;

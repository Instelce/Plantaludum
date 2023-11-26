import {Children, isValidElement, PropsWithChildren} from "react";
import "./Navbar.scss";

function Navbar({ children }: PropsWithChildren) {
  const childrenArray = Children.toArray(children);

  const leftElements = childrenArray.filter(
    (child) => isValidElement(child) && child.props.position === "left"
  )

  const rightElements = childrenArray.filter(
    (child) => isValidElement(child) && child.props.position === "right"
  )

  return (
    <div className="navbar">
      <div className="left">
        <img className="logo" src="/public/icon.svg" alt="Plantaludum icon" />

        {leftElements.map((child, index) => (
          <div key={index}>{child}</div>
        ))}
      </div>

      {rightElements.map((child, index) => (
        <div key={index}>{child}</div>
      ))}
    </div>
  );
}

export default Navbar;

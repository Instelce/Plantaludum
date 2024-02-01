import { Children, isValidElement, PropsWithChildren } from "react";
import "./Navbar.scss";
import {Link} from "react-router-dom";

function Root({ children }: PropsWithChildren) {
  const childrenArray = Children.toArray(children);

  const leftElements = childrenArray.filter(
    (child) => isValidElement(child) && child.type === Left,
  );

  const rightElements = childrenArray.filter(
    (child) => isValidElement(child) && child.type === Right,
  );

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" className="logo">
          <img src="/public/icon.svg" alt="Plantaludum icon" width={40} />
        </Link>

        {leftElements}
      </div>

      {rightElements}
    </div>
  );
}

function Left({children}: PropsWithChildren) {
  return (
    <div className="left">
      {children}
    </div>
  )
}

function Right({children}: PropsWithChildren) {
  return (
    <div className="right">
      {children}
    </div>
  )
}

export default {
  Root,
  Left,
  Right,
};

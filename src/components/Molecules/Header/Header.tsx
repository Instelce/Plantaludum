import "./Header.scss";
import {HTMLAttributes, PropsWithChildren} from "react";
import classNames from "classnames";

type HeaderProps = {
  type: "page" | "section" | "sub-section";
  sticky?: boolean;
  center?: boolean;
} & PropsWithChildren;

function Root({ type, sticky, center, children }: HeaderProps) {
  return (
    <header
      className={classNames(
        "header",
        type,
        { sticky: sticky },
        { center: center },
      )}
    >
      {children}
    </header>
  );
}

function Title({ children, ...props }: PropsWithChildren & HTMLAttributes<HTMLHeadingElement>) {
  return <h2 {...props} className={classNames("title", props.className)}>{children}</h2>;
}

function Right({ children }: PropsWithChildren) {
  return <div className="right">{children}</div>;
}

const Header = {
  Root,
  Title,
  Right,
};

export default Header;

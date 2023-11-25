import "./style.scss";
import classNames from "classnames";
import Loader from "../../Loader";
import { ButtonHTMLAttributes, FC, PropsWithChildren, ReactNode } from "react";

type ButtonProps = {
  label?: string | null;
  icon?: ReactNode | null;
  color?: "primary" | "gray" | "dark-gray" | "yellow" | "success" | "danger";
  size?: "small" | "medium" | "large";
  fill?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FC = (props: ButtonProps) => {
  const {
    label = null,
    icon = null,
    color = "primary",
    size = "large",
    disabled = false,
    fill = false,
    loading = false,
    children,
    className,
    ...otherProps
  } = props;

  return (
    <button
      title={label ? label : ""}
      className={classNames(
        "button",
        className,
        color,
        size,
        { fill: fill },
        { icon: icon !== null },
        { "only-icon": label === "" && icon != null },
        { loading: loading },
      )}
      disabled={disabled}
      {...otherProps}
    >
      {!loading ? (
        <>
          <div>{children ? children : label}</div>

          {icon !== null && <span>{icon}</span>}
        </>
      ) : (
        <Loader />
      )}
    </button>
  );
};

export default Button;

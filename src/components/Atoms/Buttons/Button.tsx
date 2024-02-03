import "./Button.scss";
import classNames from "classnames";
import { ForwardedRef, forwardRef } from "react";
import { ButtonProps } from "./ButtonProps";
import Slot from "../Slot";
import { MouseEvent } from "react";

const Button = forwardRef<HTMLElement, ButtonProps>((props, forwardedRef) => {
  const {
    asChild = false,
    label = null,
    onlyIcon = false,
    color = "primary",
    size = "large",
    bounce = true,
    disabled = false,
    fill = false,
    loading = false,
    children,
    className,
    ...otherProps
  } = props;
  const Comp = asChild ? Slot : "button";

  function soundEffect() {
    const audio = new Audio("/sounds/click.ogg");
    audio.play();
  }

  return (
    <Comp
      title={label ? label : ""}
      className={classNames(
        "button",
        className,
        color,
        size,
        { "only-icon": onlyIcon },
        { fill: fill },
        { bounce: bounce },
        { loading: loading },
      )}
      disabled={disabled}
      {...otherProps}
      ref={forwardedRef as ForwardedRef<HTMLButtonElement>}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        JSON.parse(localStorage.getItem("settings.buttonsSound") as string) &&
          soundEffect();
        props.onClick && props.onClick(e);
      }}
    >
      {children}
    </Comp>
  );
});

Button.displayName = "Button";

export default Button;

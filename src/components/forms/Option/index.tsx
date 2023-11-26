import classNames from "classnames";
import PropTypes from "prop-types";
import "./style.scss";
import {ButtonHTMLAttributes, PropsWithChildren} from "react";

type OptionProps = {
  value: string,
  active: boolean,
} & PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>

function Option({ value = null, active, children, ...props }: OptionProps) {
  return (
    <button
      type="button"
      className={classNames("option", { active: active })}
      {...props}
    >
      {children}
    </button>
  );
}

export default Option;

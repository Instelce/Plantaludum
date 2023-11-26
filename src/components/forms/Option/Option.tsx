import classNames from "classnames";
import PropTypes from "prop-types";
import "./Option.scss";
import {ButtonHTMLAttributes, PropsWithChildren} from "react";

type OptionProps = {
  value: string | null,
  active: boolean,
} & PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>

function Option({ value, active, children, ...props }: OptionProps) {
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

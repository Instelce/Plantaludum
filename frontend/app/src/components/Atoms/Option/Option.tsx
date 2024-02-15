import classNames from "classnames";
import "./Option.scss";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";

export type OptionProps = {
  value?: string | null;
  active?: boolean;
} & PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

function Option({ value, active, children, ...props }: OptionProps) {
  return (
    <button
      title={value}
      type="button"
      className={classNames("option", { active: active })}
      {...props}
    >
      {children}
    </button>
  );
}

export default Option;

import "./Switch.scss";
import React, { HTMLAttributes, useId } from "react";
import classNames from "classnames";

type SwitchProps = {
  id?: string;
  label: string;
  takeValue: string | boolean;
  value?: boolean;
  handleValueChange?: React.Dispatch<React.SetStateAction<boolean>> | null;
  disabled?: boolean;
} & HTMLAttributes<HTMLElement>;

function Switch({
  id,
  label,
  takeValue,
  value,
  handleValueChange = null,
  disabled,
  ...props
}: SwitchProps) {
  const defaultId = useId();
  const uniqueId = id ? id : defaultId;
  return (
    <div className={classNames("switch-container", props.className)}>
      <div className="switch">
        <input
          type="checkbox"
          id={uniqueId}
          name={uniqueId}
          disabled={disabled}
          value={takeValue.toString()}
          checked={value}
          onChange={(e) => handleValueChange?.(e.target.checked)}
          {...props}
        />
        <span className="slider"></span>
      </div>
      <label htmlFor={uniqueId}>{label}</label>
    </div>
  );
}

export default Switch;

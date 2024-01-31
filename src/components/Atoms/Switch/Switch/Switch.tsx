import "./Switch.scss";
import React, { InputHTMLAttributes, useId } from "react";

type SwitchProps = {
  id?: string;
  label: string;
  takeValue: string | boolean;
  value?: boolean;
  handleValueChange?: React.Dispatch<React.SetStateAction<boolean>> | null;
  disabled?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

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
    <div className="switch-container">
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

import React, { InputHTMLAttributes, useId } from "react";
import "./Checkbox.scss";

type CheckboxProps = {
  id?: string;
  label: string;
  takeValue: string;
  value?: boolean;
  handleValueChange?: React.Dispatch<React.SetStateAction<boolean>> | null;
  disabled?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

function Checkbox({
  id,
  label,
  takeValue,
  value,
  handleValueChange = null,
  disabled,
  ...props
}: CheckboxProps) {
  const defaultId = useId();
  return (
    <div className="checkbox">
      <input
        type="checkbox"
        id={id ? id : defaultId}
        name={id ? id : defaultId}
        disabled={disabled}
        value={takeValue}
        checked={value}
        onChange={(e) => handleValueChange?.(e.target.checked)}
        {...props}
      />
      <label htmlFor={id ? id : defaultId}>{label}</label>
    </div>
  );
}

export default Checkbox;

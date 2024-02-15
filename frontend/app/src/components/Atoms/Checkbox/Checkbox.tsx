import React, { HTMLAttributes, useId } from "react";
import "./Checkbox.scss";

type CheckboxProps = {
  id?: string;
  label: string;
  takeValue: string | boolean;
  value?: boolean;
  handleValueChange?: React.Dispatch<React.SetStateAction<boolean>> | null;
  disabled?: boolean;
} & HTMLAttributes<HTMLElement>;

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
  const uniqueId = id ? id : defaultId;
  return (
    <div className="checkbox">
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
      <label htmlFor={uniqueId}>{label}</label>
    </div>
  );
}

export default Checkbox;

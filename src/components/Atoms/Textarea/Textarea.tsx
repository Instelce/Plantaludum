import "./Textarea.scss";
import React, { TextareaHTMLAttributes, useId, useState } from "react";
import classNames from "classnames";

type TextareaProps = {
  id?: string;
  label: string;
  maxlength?: number;
  showActionBar?: boolean;
  disabled?: boolean;
  value?: string;
  handleValueChange?: React.Dispatch<React.SetStateAction<string>> | null;
  helperText?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

function Textarea({
  id,
  label,
  maxlength,
  showActionBar = false,
  disabled = false,
  value,
  handleValueChange = null,
  helperText,
  defaultValue,
  ...props
}: TextareaProps) {
  const defaultId = useId();
  const [valueLenght, setValueLenght] = useState(
    defaultValue ? defaultValue.toString().length : 0,
  );

  const handleChange = (value: string) => {
    setValueLenght(() => value.toString().length);

    handleValueChange ? handleValueChange(value) : null;
  };

  return (
    <div className="textarea-container">
      {showActionBar && <div className="action-bar"></div>}
      <div className="textarea-wrapper">
        <textarea
          id={id ? id : defaultId}
          name={id ? id : defaultId}
          disabled={disabled}
          placeholder=" "
          value={value ? value : undefined}
          onChange={(e) => handleChange(e.target.value)}
          defaultValue={defaultValue}
          {...props}
        ></textarea>
        <label htmlFor={id ? id : defaultId}>{label}</label>
        {maxlength && (
          <span
            className={classNames("world-counter", {
              "text-overflow": valueLenght > maxlength,
            })}
          >
            {maxlength - valueLenght}
          </span>
        )}
      </div>
      {helperText && <p className="helper-text">{helperText}</p>}
    </div>
  );
}

export default Textarea;

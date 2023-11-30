import "./Textarea.scss";
import React, {TextareaHTMLAttributes, useEffect, useId, useState} from "react";
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
  mb?: number;
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
  mb,
  ...props
}: TextareaProps) {
  const defaultId = useId();
  const [valueLenght, setValueLenght] = useState(0);

  const handleChange = (value: string) => {
    setValueLenght(() => value.toString().length);

    handleValueChange ? handleValueChange(value) : null;
  };

  return (
    <div className="textarea-container" style={{ marginBottom: mb }}>
      {showActionBar && <div className="action-bar"></div>}
      <div className="textarea-wrapper">
        <textarea
          id={id ? id : defaultId}
          name={id ? id : defaultId}
          disabled={disabled}
          placeholder=" "
          value={value ? value : undefined}
          onChange={(e) => handleChange(e.target.value)}
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

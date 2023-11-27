import "./Textarea.scss";
import React, { useEffect, useId, useState } from "react";
import classNames from "classnames";

type TextareaProps = {
  id?: string;
  label: string;
  maxLength?: number;
  showActionBar?: boolean;
  disabled?: boolean;
  value?: string;
  handleValueChange?: React.Dispatch<React.SetStateAction<string>> | null;
  helperText?: string;
  mb?: number;
};

function Textarea({
  id,
  label,
  maxLength,
  showActionBar = false,
  disabled = false,
  value,
  handleValueChange = null,
  helperText,
  mb,
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
        ></textarea>
        <label htmlFor={id ? id : defaultId}>{label}</label>
        {maxLength && (
          <span
            className={classNames("world-counter", {
              "text-overflow": valueLenght > maxLength,
            })}
          >
            {maxLength - valueLenght}
          </span>
        )}
      </div>
      {helperText && <p className="helper-text">{helperText}</p>}
    </div>
  );
}

export default Textarea;

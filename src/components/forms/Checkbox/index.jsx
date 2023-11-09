import React, { useId } from "react";
import PropTypes from "prop-types";
import "./style.scss";

function Checkbox({ id = null, label, defaultValue, value, handleValueChange = null, disabled }) {
  const defaultId = useId();
  return (
    <div className="checkbox">
      <input
        type="checkbox"
        id={id ? id : defaultId}
        name={id ? id : defaultId}
        disabled={disabled}
        value={defaultValue}
        checked={value}
        onChange={(e) => handleValueChange?.(e.target.checked)}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

Checkbox.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  defaultValue: PropTypes.string,
  value: PropTypes.bool,
  handleValueChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export default Checkbox;

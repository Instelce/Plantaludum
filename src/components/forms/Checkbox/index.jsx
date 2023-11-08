import React, { useId } from "react";
import PropTypes from "prop-types";
import "./style.scss";

function Checkbox({ label, value, handleValueChange = null, disabled }) {
  const id = useId();
  return (
    <div className="checkbox">
      <input
        checked={value}
        type="checkbox"
        name={id}
        id={id}
        disabled={disabled}
        onChange={(e) => handleValueChange?.(e.target.checked)}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

Checkbox.propTypes = {
  label: PropTypes.string,
  value: PropTypes.bool,
  handleValueChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export default Checkbox;

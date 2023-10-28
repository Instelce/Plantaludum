import React from "react";
import PropTypes from "prop-types";

import "./style.scss";

/**
 * Button
 */
function Button({
  label,
  type = "button",
  color,
  size = "lg",
  variant = "solid",
  disabled = false,
  fill = false,
  onClick
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`button ${variant} ${size} ${
        fill ? "fill" : ""
      }`}
      disabled={disabled}
      style={{ ["--color"]: `var(--color-${color})` }}
    >
      {label}
    </button>
  );
}

Button.propTypes = {
  label: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit']),
  color: PropTypes.oneOf(['primary', 'secondary', 'accent', 'success', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'big']),
  variant: PropTypes.oneOf(['outlined', 'solid', 'soft']),
  disabled: PropTypes.bool,
  fill: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Button;

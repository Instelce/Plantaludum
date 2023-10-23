import React from "react";
import PropTypes from "prop-types";

import "./style.scss";

/**
 * Button
 */
function Button({
  type = "button",
  color,
  size = "ld",
  variant = "solid",
  disabled = false,
  fill = false,
  children,
}) {
  return (
    <button
      type={type}
      className={`button ${variant} ${size} ${disabled ? "disabled" : ""} ${
        fill ? "fill" : ""
      }`}
      style={{ ["--color"]: `var(--color-${color})` }}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  type: PropTypes.string,
  children: PropTypes.node,
  color: PropTypes.string,
  size: PropTypes.string,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  fill: PropTypes.bool,
};

export default Button;

import React from "react";
import PropTypes from "prop-types";

import "./style.scss";
import classNames from "classnames";

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
  icon = null,
  ...props
}) {
  return (
    <button
      type={type}
      className={classNames(`button ${variant} ${size}`, {fill: fill}, {icon: icon !== null})}
      disabled={disabled}
      style={{ ["--color"]: `var(--color-${color})` }}
      {...props}
    >
      {label}
      {icon !== null && <span>
        {icon}
      </span>}
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
  icon: PropTypes.node,
};

export default Button;

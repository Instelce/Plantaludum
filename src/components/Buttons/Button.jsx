import React from "react";
import PropTypes from "prop-types";

import "./style.scss";
import classNames from "classnames";
import Loader from "../Loader/index.jsx";

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
  loading = false,
  ...props
}) {
  return (
    <button
      type={type}
      className={classNames(`button ${variant} ${size}}`, {fill: fill}, {icon: icon !== null}, {loading: loading})}
      disabled={disabled}
      style={{ ["--color"]: `var(--color-${color})` }}
      {...props}
    >
      {!loading ? <>
        {label}
        {icon !== null && <span>
          {icon}
        </span>}
      </> : <Loader />}
    </button>
  );
}

Button.propTypes = {
  label: PropTypes.string || PropTypes.number,
  type: PropTypes.oneOf(['button', 'submit']),
  color: PropTypes.oneOf(['primary', 'secondary', 'accent', 'success', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'big']),
  variant: PropTypes.oneOf(['outlined', 'solid', 'soft']),
  disabled: PropTypes.bool,
  fill: PropTypes.bool,
  icon: PropTypes.node,
  loading: PropTypes.bool,
};

export default Button;

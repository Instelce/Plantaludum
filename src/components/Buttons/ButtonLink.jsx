import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";
import "./style.scss";
import Button from "./Button.jsx";

/**
 * React router dom Link styled as a button
 */
function ButtonLink({
  to,
    label,
  type = "button",
  color,
  size = "ld",
  variant = "solid",
  disabled = false,
  fill = false,
  children,
}) {
  return (
    <Link to={to}>
      <Button
          label={label}
        type={type}
        color={color}
        size={size}
        variant={variant}
        disabled={disabled}
        fill={fill}
      >
        {label}
      </Button>
    </Link>
  );
}

ButtonLink.propTypes = {
  to: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  fill: PropTypes.bool,
  children: PropTypes.node,
};

export default ButtonLink;

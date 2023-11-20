import PropTypes from "prop-types";

import Button from "./Button.jsx";
import { Link } from "react-router-dom";
import "./style.scss";
import classNames from "classnames";
import Loader from "../Loader/index.jsx";

/**
 * React router dom Link styled as a button
 */
function ButtonLink({
  to,
  state={},
  label= "",
  color = "primary",
  size = "large",
  disabled = false,
  fill = false,
  icon = null,
  loading = false,
  ...props
}) {
  return (
    <Link to={to} state={state} title={label}>
      <Button
        label={label}
        color={color}
        size={size}
        disabled={disabled}
        fill={fill}
        icon={icon}
        loading={loading}
      />
    </Link>
  );
}

ButtonLink.propTypes = {
  to: PropTypes.string,
  state: PropTypes.object,
  label: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  fill: PropTypes.bool,
};

export default ButtonLink;

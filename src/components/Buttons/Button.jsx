import PropTypes from "prop-types";

import "./style.scss";
import classNames from "classnames";
import Loader from "../Loader/index.jsx";

/**
 * Button
 */
function Button ({
  label= "",
  type = "button",
  color = "primary",
  size = "large",
  disabled = false,
  fill = false,
  icon = null,
  loading = false,
  ...props
}) {
  return <button
      type={type}
      title={label}

      className={classNames(
        `button ${color} ${size}`,
        {fill: fill},
        {icon: icon !== null},
        {'only-icon': label === "" && icon != null},
        {loading: loading},
      )}

      disabled={disabled}
      {...props}
    >
      {!loading ? <>
        <span className="label">
          {label}
        </span>

        {icon !== null &&
          <span>
            {icon}
          </span>
        }
      </> : <Loader />}
    </button>
}

Button.propTypes = {
  label: PropTypes.string || PropTypes.number,
  type: PropTypes.oneOf(['button', 'submit']),
  color: PropTypes.oneOf(['primary', 'gray', 'dark-gray', 'yellow', 'success', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  fill: PropTypes.bool,
  icon: PropTypes.node,
  loading: PropTypes.bool,
};

export default Button;

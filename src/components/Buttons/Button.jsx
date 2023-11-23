import PropTypes from "prop-types";

import "./style.scss";
import classNames from "classnames";
import Loader from "../Loader/index.jsx";
import {mergeClasses} from "../../utils.js";

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
  children,
  className,
  ...props
}) {
  return <button
      type={type}
      title={label}

      className={classNames(
        className,
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
        <div>
          {children ? children : label}
        </div>

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

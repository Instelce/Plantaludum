import React from "react";
import PropTypes from "prop-types";
import "./style.scss";

function ProgressBar({
  value,
  color,
  shape = "rounded",
  thickness = "medium",
}) {
  return (
    <div className={`progress-bar ${shape} ${thickness}`}>
      <span style={{ width: `${value}%`, background: color }}></span>
    </div>
  );
}

ProgressBar.propTypes = {
  value: PropTypes.number,
  color: PropTypes.string,
  shape: PropTypes.oneOf(["rounded", "square"]),
  thickness: PropTypes.oneOf(["medium", "large"]),
};

export default ProgressBar;

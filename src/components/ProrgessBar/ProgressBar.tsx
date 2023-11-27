import React from "react";
import "./ProgressBar.scss";

type ProgressBarProps = {
  value: number;
  color: string;
  shape: "rounded" | "square";
  thickness: "medium" | "large";
};

function ProgressBar({
  value,
  color,
  shape = "rounded",
  thickness = "medium",
}: ProgressBarProps) {
  return (
    <div className={`progress-bar ${shape} ${thickness}`}>
      <span style={{ width: `${value}%`, background: color }}></span>
    </div>
  );
}

export default ProgressBar;

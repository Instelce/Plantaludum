import { Star } from "react-feather";
import PropTypes from "prop-types";
import "./style.scss";
import { cloneElement } from "react";

export default function Stars({ count, icon = null }) {
  // let Icon = icon != null ? cloneElement(icon) : Star

  let starsElements = [];
  let key = 0;

  for (let i = 0; i < count; i++) {
    starsElements.push(
      <Star
        key={key}
        color="rgb(var(--color-yellow-light))"
        fill="rgb(var(--color-yellow-light))"
      />,
    );
    key++;
  }
  for (let i = 0; i < 3 - count; i++) {
    starsElements.push(
      <Star key={key} color="rgb(var(--color-yellow-dark))" />,
    );
    key++;
  }

  return (
    <>
      <div className="row-stars">{starsElements}</div>
    </>
  );
}

Stars.propTypes = {
  count: PropTypes.number,
  icon: PropTypes.node,
};

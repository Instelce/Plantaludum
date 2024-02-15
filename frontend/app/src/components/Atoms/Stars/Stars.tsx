import { Star } from "react-feather";
import "./Stars.scss";
import React, { cloneElement, JSX, ReactNode } from "react";

type StarsProps = {
  count: number;
  icon?: ReactNode | null;
};

function Stars({ count, icon = null }: StarsProps) {
  let starsElements: JSX.Element[] = [];
  let key = 0;

  for (let i = 0; i < count; i++) {
    starsElements.push(
      cloneElement(icon ? (icon as React.ReactElement) : <Star />, {
        key: key,
        color: "rgb(var(--color-yellow-light))",
        fill: "rgb(var(--color-yellow-light))",
      }),
    );
    key++;
  }
  for (let i = 0; i < 3 - count; i++) {
    starsElements.push(
      cloneElement(icon ? (icon as React.ReactElement) : <Star />, {
        key: key,
        color: "rgb(var(--color-yellow-dark))",
      }),
    );
    key++;
  }

  return (
    <>
      <div className="row-stars">{starsElements}</div>
    </>
  );
}

export default Stars;

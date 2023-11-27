import { Star } from "react-feather";
import "./Stars.scss";
import React, {createElement, JSX, ReactNode} from "react";

type StarsProps = {
  count: number;
  icon: ReactNode | null;
}

function Stars({ count, icon }: StarsProps) {
  const Icon = icon || Star;
  let starsElements: JSX.Element[] = [];
  let key = 0;

  for (let i = 0; i < count; i++) {
    starsElements.push(
        createElement(Icon as React.ElementType, {
          key: {key}, color: "rgb(var(--color-yellow-light))", fill: "rgb(var(--color-yellow-light))"})
    );
    key++;
  }
  for (let i = 0; i < 3 - count; i++) {
    starsElements.push(
      createElement(Icon as React.ElementType, {
        key: {key}, color: "rgb(var(--color-yellow-dark))"})
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
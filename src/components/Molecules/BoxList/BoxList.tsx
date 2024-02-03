import "./BoxList.scss";
import {ColorType, SizeProp} from "../../../types/helpers";
import React, { LiHTMLAttributes, PropsWithChildren } from "react";
import classNames from "classnames";

type BoxListGroupProps = {
  size: SizeProp;
  rounded?: boolean;
  background?: ColorType;
  hasBorder?: boolean;
} & PropsWithChildren;

function Group({ size, rounded = true, background = "dark-gray", hasBorder = true, children }: BoxListGroupProps) {
  return (
    <ul className={classNames("box-list-group", size, { border: hasBorder }, { rounded: rounded }, background)}>
      {children}
    </ul>
  );
}

type BoxListItemProps = {
  color?: ColorType;
  active?: boolean
} & PropsWithChildren &
  LiHTMLAttributes<HTMLLIElement>;

export function Item({
  color = "gray",
  active = false,
  children,
  ...props
}: BoxListItemProps) {
  return (
    <li {...props} className={classNames("box-list-item", {active: active}, color, props.className)}>
      {children}
    </li>
  );
}

export default {
  Group,
  Item,
};

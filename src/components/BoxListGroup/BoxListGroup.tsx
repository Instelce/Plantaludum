import "./BoxListGroup.scss";
import { SizeProp } from "../../types/helpers";
import React, { PropsWithChildren } from "react";
import classNames from "classnames";

type BoxListGroupProps = {
  size: SizeProp;
  rounded: boolean;
  children: React.ReactNode;
};

function BoxListGroup({ size, rounded, children }: BoxListGroupProps) {
  return (
    <ul className={classNames("box-list-group", size, { rounded: rounded })}>
      {children}
    </ul>
  );
}

export function BoxListItem({ children }: PropsWithChildren) {
  return <li className="box-list-item">{children}</li>;
}

export default BoxListGroup;

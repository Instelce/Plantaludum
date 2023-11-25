import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
} from "react";

function Slot({ children, ...props }) {
  if (isValidElement(children)) {
    return cloneElement(children, {
      ...props,
      ...children.props,
    });
  }

  if (Children.count(children) > 1) {
    Children.only(null);
  }

  return null;
}

export default Slot;

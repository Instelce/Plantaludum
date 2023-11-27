import React, {
  Children,
  cloneElement,
  forwardRef,
  HTMLAttributes,
  isValidElement,
} from "react";

type SlotProps = {
  children: React.ReactNode;
} & HTMLAttributes<HTMLElement>;

type AnyProps = Record<string, any>;

type PossibleRef<T> = React.Ref<T> | undefined;

const Slot = forwardRef<HTMLElement, SlotProps>(
  (props: SlotProps, forwardedRef) => {
    const { children, ...slotProps } = props;

    if (isValidElement(children)) {
      return cloneElement(children, {
        ...mergeProps(slotProps, children.props),
        ref: forwardedRef
          ? composeRefs(forwardedRef, (children as any).ref)
          : (children as any).ref,
      });
    }

    if (Children.count(children) > 1) {
      Children.only(null);
    }

    return null;
  },
);

Slot.displayName = "Slot";

function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

function composeRefs<T>(...refs: PossibleRef<T>[]) {
  return (node: T) => refs.forEach((ref) => setRef(ref, node));
}

function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
  const overrideProps = { ...childProps };

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          slotPropValue(...args);
          childPropValue(...args);
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue]
        .filter(Boolean)
        .join(" ");
    }
  }

  return { ...slotProps, ...overrideProps };
}

export default Slot;

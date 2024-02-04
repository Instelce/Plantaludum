import { ButtonHTMLAttributes, ReactNode } from "react";
import { ColorType } from "../../../types/helpers";

export type ButtonProps = {
  asChild?: boolean;
  label?: string | null;
  onlyIcon?: boolean;
  color?: ColorType;
  size?: "small" | "medium" | "large";
  bounce?: boolean;
  fill?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

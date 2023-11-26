import { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonProps = {
  asChild?: boolean;
  label?: string | null;
  onlyIcon?: boolean;
  color?: "primary" | "gray" | "dark-gray" | "yellow" | "success" | "danger";
  size?: "small" | "medium" | "large";
  fill?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export type SizeProp = "small" | "medium" | "large" | undefined;
export type StatusProp = "info" | "success" | "danger" | "warning";

export type TimeoutRef = ReturnType<typeof setTimeout>;

export type SettingsType = {
  showRankingTab: boolean;
  switchingGardenSection: boolean;
  buttonsSound: boolean;
  imageDefilementEnabled: boolean;
  imageDefilementTime: string;
};

export type ColorType =
  | "primary"
  | "gray"
  | "dark-gray"
  | "yellow"
  | "success"
  | "danger";

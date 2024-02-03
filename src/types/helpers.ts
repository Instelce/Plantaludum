export type SizeProp = "small" | "medium" | "large";
export type StatusProp = "info" | "success" | "danger" | "warning";

export type TimeoutRef = ReturnType<typeof setTimeout>;

export type SettingsType = {
  showRankingTab: boolean;
  switchingGardenSection: boolean;
  buttonsSound: boolean;
}
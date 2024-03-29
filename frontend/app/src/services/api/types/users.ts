export interface UserType {
  id: number;
  username: string;
  email: string;
  level: number;
  score: number;
  games_played: number;
  identifications: number;
}

// Forms data
export type RegisterFormDataType = {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type LoginFormDataType = {
  email: string | null;
  password: string | null;
};

// Response
export type HelperLoginType = {
  detail?: string;
  email?: string;
  password?: string;
};

export type HelperRegisterType = {
  detail?: string;
  username?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
};

export interface User {
  id: number;
  username: string;
  email: string;
  level: number;
  score: number;
  games_played: number;
}

export interface UserPlayedDeck {
  id: number;
  deck_id: number;
  user_id: number;
}

// Forms data
export type RegisterFormDataType = {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type LoginFormDataType = {
  email: string;
  password: string;
};

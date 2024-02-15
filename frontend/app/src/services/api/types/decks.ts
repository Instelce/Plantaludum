export interface DeckType {
  id: number;
  name: string;
  description: string;
  difficulty: number;
  preview_image_url: string;
  created_at: Date;
  times_played: number;
  private: boolean;
  user: {
    id: number;
    username: string;
  };
}

export interface DeckPlantType {
  id: number;
  plant_id: number;
  deck: number;
}

export interface UserPlayedDeckType {
  id: number;
  user: number;
  deck: DeckType;
  level: number;
  current_stars: number;
}

// Forms data
export interface CreateDeckFormDataType {
  name: string;
  description: string;
  difficulty: string;
  preview_image_url: string;
  private: boolean;
  user: number;
}

export interface CreateDeckPlantFormDataType {
  deck: number;
  plant_id: number;
}

export interface UpdateDeckFormDataType {
  name?: string;
  description?: string;
  difficulty?: number;
  preview_image_url?: string;
  created_at?: Date;
  times_played?: number;
  private?: boolean;
  user?: number;
}

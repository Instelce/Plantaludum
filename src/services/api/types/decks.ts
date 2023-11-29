export interface DeckType {
  id: number;
  name: string;
  description: string;
  difficulty: number;
  preview_image_url: string;
  created_at: Date;
  times_played: number;
  private: boolean;
  user_id: number;
}

export interface DeckPlantType {
  id: number;
  plant_id: number;
  deck_id: number;
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

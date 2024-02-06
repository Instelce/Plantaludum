export type IdentificationType = {
  id: number;
  user: number;
  user_played_deck: number;
  plant_id: number;
  image_id: number;
  answer: number;
};

export type UpdateIdentificationType = {
  user?: number;
  user_played_deck?: number;
  plant_id?: number;
  image_id?: number;
  answer?: number;
}
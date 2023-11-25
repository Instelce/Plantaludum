export interface PlantType {
  id: number;
  num_inpn: string;
  rank_code: string;
  family_id: number;
  genre_id: number;
  scientific_name: string;
  correct_name: string;
  french_name: string;
  author: string;
  publ_date: string;
  eflore_url: string;
}

export interface PlantsType {
  count: number;
  results: PlantType[];
}

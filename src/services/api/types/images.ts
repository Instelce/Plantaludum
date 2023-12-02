export interface ImageType {
  id: number;
  author: string;
  location: string;
  publ_date: string;
  organ: string;
  plant_id: number;
  url: string;
}

export interface PlantImagesType {
  id: number;
  images: ImageType[];
}
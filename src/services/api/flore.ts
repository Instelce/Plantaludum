import { apiFlore } from "./axios";
import { PlantType } from "./types/plants";
import {PlantImagesType} from "./types/images";

export function loadRandomPlants(number = 10) {
  return apiFlore
    .get(`api/plants/random/${number}`)
    .then((r) => r.data as PlantType[]);
}

export function loadPlants({
  search = null,
  fieldFilters = {
    rank_code: null,
    family__name: null,
    genre__name: null,
    author: null,
  },
}) {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  for (const [key, value] of Object.entries(fieldFilters)) {
    if (value !== null) {
      params.set(key, value);
    }
  }

  return apiFlore.get(`api/plants?${params.toString()}`).then((r) => r.data);
}

export function loadPlantsIdsList(ids: number[]) {
  const params = new URLSearchParams();

  params.set("ids", ids.join(","));

  return apiFlore
    .get(`api/plants-list?${params.toString()}`)
    .then((r) => r.data);
}

export function loadPlantsIdsListImages(ids: number[]) {
  const params = new URLSearchParams();

  params.set("ids", ids.join(","));

  return apiFlore
    .get(`api/plants-list/images?${params.toString()}`)
    .then((r) => r.data as PlantImagesType[]);
}

type LoadImagesArgs = {
  plant__id?: number | null;
  plant__french_name?: string | null;
  organ?: string | null;
};

export function loadImages(
  fieldFilters: LoadImagesArgs = {
    plant__id: null,
    plant__french_name: null,
    organ: null,
  },
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(fieldFilters)) {
    if (value !== null) {
      params.set(key, value as string);
    }
  }

  console.log(params.toString());

  return apiFlore.get(`api/images?${params.toString()}`).then((r) => r.data);
}

const plants = {
  list: loadPlants,
  getWithIds: loadPlantsIdsList,
  random: loadRandomPlants,
};

const images = {
  list: loadImages,
  getWithPlantsIds: loadPlantsIdsListImages,
};

export const flore = {
  plants,
  images,
};

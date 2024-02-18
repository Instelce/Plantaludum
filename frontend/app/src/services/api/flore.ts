import { apiFlore } from "./axios";
import { ImageType, PlantImagesType } from "./types/images";
import { loadURLParams } from "../../utils/helpers";
import { CompletePlantImagesType, PlantType } from "./types/plants";

export function loadRandomPlants({
  number = 10,
  params = {},
}: {
  number?: number;
  params?: {
    images?: boolean;
    family?: string;
  };
}) {
  const _params = new URLSearchParams();

  loadURLParams(_params, params);

  return apiFlore
    .get(`api/plants/random/${number}?${_params}`)
    .then((r) => r.data as CompletePlantImagesType[]);
}

export function loadPlants({
  search = null,
  filterFields = {
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

  loadURLParams(params, filterFields);

  return apiFlore.get(`api/plants?${params.toString()}`).then((r) => r.data);
}

export function loadPlantsIdsList(ids: number[]) {
  const params = new URLSearchParams();

  params.set("ids", ids.join(","));

  return apiFlore
    .get(`api/plants-list?${params.toString()}`)
    .then((r) => r.data as PlantType[]);
}

export function loadPlantsIdsListImages(ids: number[]) {
  const params = new URLSearchParams();

  params.set("ids", ids.join(","));

  return apiFlore
    .get(`api/plants-list/images?${params.toString()}`)
    .then((r) => r.data as PlantImagesType[]);
}

function loadImagesIdsList(ids: number[]) {
  const params = new URLSearchParams();

  params.set("ids", ids.join(","));

  return apiFlore
    .get(`api/images-list?${params.toString()}`)
    .then((r) => r.data as ImageType[]);
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
  getWithIds: loadImagesIdsList,
};

export const flore = {
  plants,
  images,
};

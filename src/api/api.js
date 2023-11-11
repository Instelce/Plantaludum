import api, {apiFlore, apiPrivate} from "./axios.js";


// -----------------------------------------------------------------------------
// AUTH PLANTALUDUM API

export function login(data) {
  return api.post('/auth/login', data, {withCredentials: true})
    .then(r => r)
}

export function register(data) {
  return api.post('/auth/register', data)
    .then(r => r)
}

// -----------------------------------------------------------------------------
// PLANTALUDUM API

export function loadQuiz(id) {
  return api.get(`/api/quizzes/${id}`)
    .then(r => r.data)
}

export function loadQuizPlants(fieldFilters = {
  quiz__id: null,
  plant_id: null
}) {
  const params = new URLSearchParams()

  for (const fieldFilter of Object.entries(fieldFilters)) {
    if (fieldFilters[1] !== null) {
      params.set(fieldFilter[0], fieldFilter[1])
    }
  }

  return api.get(`/api/quizzes-plants?${params}`)
    .then(r => r.data)
}

export function createQuiz(privateFetch, data) {
  return privateFetch.post('/api/quizzes', data)
    .then(r => r.data)
}

export function createQuizPlant(privateFetch, data) {
  return privateFetch.post('/api/quizzes-plants', data)
    .then(r => r.data)
}


// -----------------------------------------------------------------------------
// FLORE API

export function loadRandomPlants(number = 10) {
  return apiFlore
    .get(`api/plants/random/${number}`)
    .then(r => r.data)
}


export function loadPlants({
  search = null,
  list = null,
  fieldFilters = {
    rank_code: null,
    family__name: null,
    genre__name: null,
    author: null,
  }
}) {
  const params = new URLSearchParams()

  if (search) {
    params.set('search', search)
  }

  if (list) {
    params.set('list', list)
  }

  if (fieldFilters.length) {
    for (const fieldFilter of fieldFilters) {
      console.log("f", fieldFilter)
    }
  }

  return apiFlore
    .get(`api/plants?${params.toString()}`)
    .then(r => r.data)
}


export function loadImages(fieldFilters = {
  'plant__id': null,
  'plant__french_name': null,
  'organ': null,
}) {
  const params = new URLSearchParams()

  for (const fieldFilter of Object.entries(fieldFilters)) {
    if (fieldFilters[1] !== null) {
      params.set(fieldFilter[0], fieldFilter[1])
    }
  }

  console.log(params.toString())

  return apiFlore
    .get(`api/images?${params.toString()}`)
    .then(r => r.data)
}

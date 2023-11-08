import {random} from "gsap/gsap-core";


export function getRandomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min))
}


export function arrayChoice(array, num= 1) {
  let choices = []

  for (let i = 0; i < num; i++) {
    let choice = array[Math.floor(Math.random() * array.length)]
    while (choice in choices) {
      console.log("sup", choice)
      choice = array[Math.floor(Math.random() * array.length)]
    }
    choices.push(choice)
  }

  return choices
}

export function deleteDublicates(array) {
  return array.filter((value, index) => {
    return array.indexOf(value) === index
  })
}


export async function simpleFetch(url, options={}) {
    let loading = false
    let data = []
    let error = undefined

    await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Content-Type': 'application/json; utf-8',
        }
    })
      .then(response => response.json())
      .then(d => {
          data = d
          loading = true
      }).catch(e => {
        error = e
      })

    return {loading: loading, data: data, error: error}
}

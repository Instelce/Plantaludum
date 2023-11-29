export function getRandomInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min));
}

export function arrayChoice(array: [], num: number = 1) {
  let choices: [] = [];

  for (let i = 0; i < num; i++) {
    let choice = array[Math.floor(Math.random() * array.length)];
    while (choice in choices) {
      console.log("sup", choice);
      choice = array[Math.floor(Math.random() * array.length)];
    }
    choices.push(choice);
  }

  return choices;
}

export function getObjectKeyValues(object, key) {
  return Object.values(object).map((v) => v[key]); // array of plant id
}

export function deleteDublicates(array) {
  return array.filter((value, index) => {
    return array.indexOf(value) === index;
  });
}

export function shuffleArray(array) {
  return array.sort((a, b) => 0.5 - Math.random());
}

export async function simpleFetch(url, options = {}) {
  let loading = false;
  let data = [];
  let error = undefined;

  await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json; utf-8",
    },
  })
    .then((response) => response.json())
    .then((d) => {
      data = d;
      loading = true;
    })
    .catch((e) => {
      error = e;
    });

  return { loading: loading, data: data, error: error };
}

export function mergeClasses(classes) {
  return classes.join(" ");
}

export async function downloadImage(imageSrc: string, imageName: string) {
  const imageResponse = await fetch(imageSrc, {
    mode: "no-cors",
    headers: {
      "Cross-Origin": "Resource Sharing",
      "Access-Control-Allow-Origin": "*",
    },
  });
  console.log(imageResponse);
  const imageBlob = await imageResponse.blob();
  console.log(imageBlob);
  const image = new Image();
  image.src = URL.createObjectURL(imageBlob);
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    console.log(image);
    const img = canvas.toDataURL("image/jpg");
    document.write('<img src="' + img + '" />');
  };
}

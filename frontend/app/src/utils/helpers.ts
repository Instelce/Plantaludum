export function getRandomInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min));
}

export function arrayChoice(array: any[], num: number = 1) {
  let choices: any[] = [];

  for (let i = 0; i < num; i++) {
    let choice = array[Math.floor(Math.random() * array.length)];
    while (choice in choices) {
      // console.log("sup", choice);
      choice = array[Math.floor(Math.random() * array.length)];
    }
    choices.push(choice);
  }

  return choices;
}

export function getObjectKeyValues<T>(object: T[], key: keyof T) {
  return Object.values(object).map((v) => v[key]); // array of plant id
}

export function deleteDublicates(array: any[]) {
  return array.filter((value, index) => {
    return array.indexOf(value) === index;
  });
}

export function shuffleArray(array: any[]) {
  // eslint-disable-next-line no-unused-vars
  return array.sort((a, b) => 0.5 - Math.random());
}

export function removeAccent(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function getAnotherFormat(imageUrl: string, newFormat: string): string {
  return imageUrl.replace("L.jpg", `${newFormat}.jpg`);
}

export function loadURLParams(URLParams: URLSearchParams, params: object) {
  for (const [key, value] of Object.entries(params)) {
    if (value !== null) {
      URLParams.set(key, value);
    }
  }
}

export function getCurrentTime() {
  const date = new Date();
  return {
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
  };
}

export function numberWithSpaces(number: number): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function numberWithZero(number: number): string {
  return number.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });
}

export async function downloadImage(url: string, filename: string) {
  fetch(url)
    .then(response => {
      console.log(response);
      return response.blob()
    })
    .then(blob => {
      console.log(blob);
      let blobUrl = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.download = filename;
      a.href = blobUrl;
      a.target = '_blank'
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl)
      }, 0);
    })
    .catch(error => {
      console.error('Error downloading image:', error);
    });
}
// PlantQuiz.stories.js

import PlantCard from "./index.jsx";


export default {
    title: 'WebApp/PlantQuiz',
    component: PlantCard,
    parameters: {
    },
}


export const Default = {
    args: {
        show: false,
        plant: {
            name: "Plant Name",
            found: false,
            images: [
                "https://api.tela-botanica.org/img:000067643CRS.jpg",
                "https://api.tela-botanica.org/img:000067644CRS.jpg",
                "https://api.tela-botanica.org/img:000023106CRS.jpg",
            ],
            choices: [
                {title: "P1", subtitle: "Lorem ipsum.", rightAnswer: false},
                {title: "P2", subtitle: "Lorem ipsum..", rightAnswer: true},
                {title: "P3", subtitle: "Lorem ipsum...", rightAnswer: false}
            ]
        }
    }
}

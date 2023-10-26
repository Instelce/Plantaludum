import React from "react";
import Input from "../components/forms/Input/index.jsx";
import PlantCard from "../components/PlantCard/index.jsx";


const plants = [
  {
    name: "Arbres fruitiers",
    description: "Lorem ipsum dolor sit amet consectetur. Erat amet porta netus mauris accumsan tellus massa in justo. Et tellus tempor lorem in sed. Lorem vel sit rhoncus vitae quis feugiat. Fringilla rutrum ac viverra odio ultrices risus nunc nunc.",
    difficulty: 2,
    images: [
      "https://api.tela-botanica.org/img:000067643CRS.jpg",
      "https://api.tela-botanica.org/img:000067644CRS.jpg",
      "https://api.tela-botanica.org/img:000023106CRS.jpg",
    ],
  },
  {
    name: "Verveines et ses confusions",
    description: "Lorem ipsum dolor sit amet consectetur. Erat amet porta netus mauris accumsan tellus massa in justo. Et tellus tempor lorem in sed. Lorem vel sit rhoncus vitae quis feugiat.",
    difficulty: 1,
    images: [
      "https://api.tela-botanica.org/img:000023106CRS.jpg",
      "https://api.tela-botanica.org/img:000067644CRS.jpg",
      "https://api.tela-botanica.org/img:000067643CRS.jpg",
    ],
  }
]


function Explorer(props) {
  return <div className="container explorer">
    <div className="topbar">
      <div>
        <h1>Plantaludum</h1>
        <p>Explorer</p>
      </div>
      <Input
        label="Rechercher"
        size="big"
      />
      <span>
        ...
      </span>
    </div>
    <div className="grid">
      {plants.map((plant, index) => (
        <PlantCard key={plant.name} plant={plant}/>
      ))}
    </div>
  </div>;
}

export default Explorer;

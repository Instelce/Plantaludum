import "./style.scss";

function PlantCard({plant, images, ...props}) {
  console.log(images)
  return (
    <div className="plant-card" {...props}>
      <div className="img-container">
        {images?.map((src, index) => (
          <img key={index} src={src} alt={`Image de ${plant.name}`}/>
        ))}
      </div>
      <div className="card-content">
        <p>{plant.name}</p>
      </div>
    </div>
  );
}

export default PlantCard;
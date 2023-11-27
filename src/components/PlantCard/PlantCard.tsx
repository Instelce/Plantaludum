import "./PlantCard.scss";
import { PlantType } from "../../services/api/types/plants";

type PlantCardProps = {
  plant: PlantType;
  images: Array<string>;
};

function PlantCard({ plant, images, ...props }: PlantCardProps) {
  return (
    <div className="plant-card" {...props}>
      <div className="img-container">
        {images?.map((src, index) => (
          <img key={index} src={src} alt={`Image de ${plant.french_name}`} />
        ))}
      </div>
      <div className="card-content">
        <p>{plant.french_name}</p>
      </div>
    </div>
  );
}

export default PlantCard;

import React from 'react';

import './style.scss'

/**
 * @param {src: string, name: string, size: number} plant
 * @param x
 * @param y
 */
function PlantCard({plant, handleClick}) {
    return (
        <div
            className="plant-card"
            style={{
                width: plant.size+"px",
                height: plant.size+"px",
                left: plant.x+"%",
                top: plant.y+"%"
            }}
            onClick={(e) => handleClick(e, plant)}
        >
            <div className="card-image">
                <img src={plant.src} alt={plant.name} />
            </div>
            <div className="card-bubble">
                {plant.found ? plant.name : "?"}
            </div>
        </div>
    );
}

export default PlantCard;

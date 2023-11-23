import React from 'react';

import './style.scss'
import PropTypes from "prop-types";

/**
 *
 */
function FloatingPlantCard({plant, handleClick}) {
    return (
        <div
            className="floating-plant-card"
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


FloatingPlantCard.propTypes = {
    plant: PropTypes.shape({
        size: PropTypes.number,
        x: PropTypes.number,
        y: PropTypes.number,
        found: PropTypes.bool,
        name: PropTypes.string,
        src: PropTypes.string,
    }),
    handleClick: PropTypes.func,
}

export default FloatingPlantCard;

import React, {useState} from 'react';

import './style.scss'
import {ArrowLeft, ArrowRight} from "react-feather";

function Slider({images}) {
    const [current, setCurrent] = useState(0)
    const lenght = images?.length;

    const next = () => {
        setCurrent((current) => current === lenght - 1 ? 0 : current + 1)
    }

    const prev = () => {
        setCurrent((current) => current === 0 ? lenght - 1 : current - 1)
    }

    if (!Array.isArray(images) || images?.length <= 0) {
        return null
    }

    return (
        <div className="slider">
            <div className="slide-container">
                {images?.map((src, index) => (
                    <div key={src} index={index} className={index === current ? 'slide active' : 'slide'}>
                        <img src={src} alt={index} />
                    </div>
                ))}
            </div>
            <div className="slider-action">
                <ArrowLeft onClick={prev} />
                <p className="slider-info">
                    {current + 1}
                    <span></span>
                    {lenght}
                </p>
                <ArrowRight onClick={next} />
            </div>
        </div>
    );
}

export default Slider;
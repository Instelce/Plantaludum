import React, {useState} from 'react';

import './style.scss'
import {ArrowLeft, ArrowRight} from "react-feather";
import PropTypes from "prop-types";

/**
 * Image slider, take an array of image url.
 */
function ImageSlider({images}) {
    const [current, setCurrent] = useState(0)
    const length = images?.length;

    // reset images
    const [prevImages, setPrevImages] = useState(images);
    if (images !== prevImages) {
        setCurrent(0)
        setPrevImages(images)
    }

    const next = () => {
        setCurrent((current) => current === length - 1 ? 0 : current + 1)
    }

    const prev = () => {
        setCurrent((current) => current === 0 ? length - 1 : current - 1)
    }

    if (!Array.isArray(images) || images?.length <= 0) {
        return null
    }

    return (
        <div className="slider">
            <div className="slide-container">
                {images?.map((src, index) => (
                    <div key={src} className={index === current ? 'slide active' : 'slide'}>
                        <img src={src} alt={index} />
                    </div>
                ))}
            </div>
            <div className="slider-action">
                <ArrowLeft onClick={prev} />
                <p className="slider-info">
                    {current + 1}
                    <span></span>
                    {length}
                </p>
                <ArrowRight onClick={next} />
            </div>
        </div>
    );
}

ImageSlider.propTypes = {
    images: PropTypes.arrayOf(PropTypes.string),
}

export default ImageSlider;
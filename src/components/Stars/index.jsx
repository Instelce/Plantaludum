import {Star} from "react-feather";
import React from "react";
import PropTypes from "prop-types";
import './style.scss'

export default function Stars ({count}) {
    let starsElem = []
    for (let i = 0; i < count; i++) {
        starsElem.push(<Star color="#FFCC00" fill="#FFCC00" />)
    }
    for (let i = 0; i < 3 - count; i++) {
        starsElem.push(<Star color="rgba(var(--color-secondary), .2)" fill="rgba(var(--color-secondary), .2)" />)
    }

    return <>
        <div className="row-stars">
            {starsElem}
        </div>
    </>
}

Stars.propTypes = {
    count: PropTypes.number,
}
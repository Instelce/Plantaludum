import {Star} from "react-feather";
import React from "react";
import PropTypes from "prop-types";
import './style.scss'

export default function Stars ({count}) {
    let starsElem = []
    let key = 0;
    for (let i = 0; i < count; i++) {
        starsElem.push(<Star key={key} color="#FFCC00" fill="#FFCC00" />)
        key++;
    }
    for (let i = 0; i < 3 - count; i++) {
        starsElem.push(<Star key={key} color="rgba(var(--color-secondary), .2)" fill="rgba(var(--color-secondary), .2)" />)
        key++;
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
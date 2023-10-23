import React from 'react';

import './style.scss'
import ButtonLink from "../Buttons/ButtonLink.jsx";
import PropTypes from "prop-types";

function Navbar({childrenLeft, childrenRight}) {
    return (
        <div className="navbar">
            <span className="gradient"></span>
            <div className="navbar-left">
                <div className="title">
                    <h1>Plantaludum</h1>
                </div>

                <nav>
                    <ul>
                        <li>Classement</li>
                    </ul>
                </nav>
            </div>
            
            <div className="navbar-right">
                <ButtonLink to="/inscription" color="primary" size="ld" variant="solid">Jouer</ButtonLink>
            </div>
        </div>
    );
}

Navbar.propTypes = {
    childrenLeft: PropTypes.node,
    childrenRight: PropTypes.node
}

export default Navbar;

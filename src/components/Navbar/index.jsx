import React, {Children, useEffect} from 'react';

import './style.scss'
import ButtonLink from "../Buttons/ButtonLink.jsx";
import PropTypes from "prop-types";

function Navbar({children}) {
    const childrens = Children.toArray(children)

  useEffect(() => {
    childrens.map(child => {
      console.log(child?.props?.children)
    })
    console.log("cou", childrens.filter(child => child?.props?.className === 'left'))
  }, []);

    return (
        <div className="navbar">
            <div className="left">
                <img className="logo" src="/public/icon.svg" alt="Plantaludum icon"/>

                {childrens.filter(child => child?.props?.className === 'left')?.[0]?.props?.children}
            </div>

            {childrens.filter(child => child?.props?.className === 'right')}
        </div>
    );
}

Navbar.propTypes = {
    childrenLeft: PropTypes.node,
    childrenRight: PropTypes.node
}

export default Navbar;

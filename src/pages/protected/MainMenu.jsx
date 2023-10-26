import React, { useRef } from "react";
import { Link, useOutlet } from "react-router-dom";

export default MainMenu;

function MainMenu(props) {
    const outlet = useOutlet()
    const hoverSound = useRef(null)

    const handleHover = () => {
        hoverSound.current.play()
    }
    const handleLeave = () => {
        hoverSound.current.pause()
        hoverSound.current.currentTime = 0;
    }

    return (
        <div>
            {outlet ||
                <div className="container center fill-window">
                    <div className="mainmenu">
                        <h1 className="main-title">Plantaludum</h1>
                        <div className="menu-wrapper">
                            <div className="menu-img">
                                <img src="https://api.tela-botanica.org/img:000116167CRS.jpg" />
                            </div>
                            <nav>
                                <ul>
                                    <li><Link to="/menu/choix" onMouseEnter={handleHover} onMouseLeave={handleLeave}>Jouer</Link></li>
                                    <li><Link to="" onMouseEnter={handleHover} onMouseLeave={handleLeave}>Nouveau deck</Link></li>
                                    <li><Link to="/explorer" onMouseEnter={handleHover} onMouseLeave={handleLeave}>Explorer</Link></li>
                                    <li><Link to="" onMouseEnter={handleHover} onMouseLeave={handleLeave}>Duel</Link></li>
                                    <li><Link to="" onMouseEnter={handleHover} onMouseLeave={handleLeave}>Classement</Link></li>
                                    <li><Link to="" onMouseEnter={handleHover} onMouseLeave={handleLeave}>Profile</Link></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                    <audio ref={hoverSound} src="/hover.wav" style={{display: "none"}}>
                    </audio>
                </div>
            }
        </div>
    );
}

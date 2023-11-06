import {useEffect, useRef} from "react";
import { Link, useOutlet } from "react-router-dom";
import usePrivateFetch from "../../hooks/usePrivateFetch.js";
import useRefreshToken from "../../hooks/useRefreshToken.js";
import Button from "../../components/Buttons/Button.jsx";
import useLogout from "../../hooks/useLogout.js";

export default MainMenu;

function MainMenu(props) {
    const outlet = useOutlet()
    const hoverSound = useRef(null)
    const privateFetch = usePrivateFetch()
    const refresh = useRefreshToken()
    const logout = useLogout()

    const handleHover = () => {
        hoverSound.current.play()
    }
    const handleLeave = () => {
        hoverSound.current.pause()
        hoverSound.current.currentTime = 0;
    }

    const addQuiz = () => {
        privateFetch.post('/api/quizzes', {
            "name": "niceeee",
            "description": "Lorem ipsum dolor sit amet. okokok",
            "difficulty": 3,
            "private": true,
            "user": 1
        }).then(r => {
            console.log(r.data, r.headers)
        }).catch(error => {
            console.log(error.data, error.headers)
        })
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
                                    <li><Button label="Refresh" color="primary" onClick={refresh}>Refresh</Button></li>
                                    <li><Button label="New" color="primary" onClick={addQuiz} /></li>
                                    <li><Button label="Logout" color="primary" onClick={logout} /></li>
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

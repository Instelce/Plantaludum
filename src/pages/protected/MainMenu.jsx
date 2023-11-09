import {useEffect, useRef} from "react";
import { Link, useOutlet } from "react-router-dom";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch.js";
import useRefreshToken from "../../hooks/auth/useRefreshToken.js";
import Button from "../../components/Buttons/Button.jsx";
import useLogout from "../../hooks/auth/useLogout.js";
import useUser from "../../hooks/auth/useUser.js";
import useAuth from "../../hooks/auth/useAuth.js";

export default MainMenu;

function MainMenu(props) {
    const outlet = useOutlet()
    const {user} = useAuth()
    const hoverSound = useRef(null)
    const privateFetch = usePrivateFetch()
    const refresh = useRefreshToken()
    const logout = useLogout()
    const getUser = useUser()

    // set user is first login
    useEffect(() => {
        console.log(user)
        if (Object.keys(user).length === 0) {
            console.log("nice")
            getUser()
            console.log(user)
        }
    }, [])

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
                                    <li><Link to="/quiz/create" onMouseEnter={handleHover} onMouseLeave={handleLeave}>Nouveau deck</Link></li>
                                    <li><Link to="/explorer" onMouseEnter={handleHover} onMouseLeave={handleLeave}>Explorer</Link></li>
                                    {/*<li><Link to="" onMouseEnter={handleHover} onMouseLeave={handleLeave}>Duel</Link></li>*/}
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

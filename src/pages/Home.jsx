import React, {useEffect, useRef, useState} from 'react';
import Navbar from "../components/Navbar/index.jsx";
import {styled} from "styled-components"
import {css} from "@emotion/css";
import FloatingPlantCard from "../components/FloatingPlantCard/index.jsx";
import {getRandomInt} from "../utils.js";
import PlantQuiz from "../components/PlantQuiz/index.jsx";
import animate from "../animate.js";
import ButtonLink from "../components/Buttons/ButtonLink.jsx";


function createPlants() {
    const plantsSrc = [
        "https://api.tela-botanica.org/img:000243414CRS.jpg",
        "https://api.tela-botanica.org/img:000208259CRS.jpg",
        "https://api.tela-botanica.org/img:000244988CRS.jpg",
        "https://api.tela-botanica.org/img:000073996CRS.jpg",
        "https://api.tela-botanica.org/img:000192173CRS.jpg",
        "https://api.tela-botanica.org/img:002479913CRS.jpg",
        "https://api.tela-botanica.org/img:000116167CRS.jpg",
        "https://api.tela-botanica.org/img:000092753CRS.jpg",
        "https://api.tela-botanica.org/img:002251388CRS.jpg",
        "https://api.tela-botanica.org/img:001118914CRS.jpg",
    ]
    let plants = []
    let size = 300;
    let col = -1

    for (let i = 0; i < plantsSrc.length; i++) {
        if (i%2 === 0) {
            col += 1
        }
        console.log(Math.ceil(plantsSrc.length/2/2), col, plantsSrc[i])
        plants.push({
            src: plantsSrc[i],
            size: size,
            name: `Vesce fausse-esparcette ${getRandomInt(0, 100)}`,
            found: false,
            x: 20*col+3,
            y: (col === Math.ceil(plantsSrc.length/2/2-1) ? (i%2 === 0 ? getRandomInt(10, 15) : getRandomInt(60, 70)) : (i%2 === 0 ? getRandomInt(10, 20) : getRandomInt(50, 60))),
            images: [
                "https://api.tela-botanica.org/img:000067643CRS.jpg",
                "https://api.tela-botanica.org/img:000067644CRS.jpg",
                "https://api.tela-botanica.org/img:000023106CRS.jpg",
            ],
            choices: [
                {title: "Vesce fausse-esparcette", subtitle: "Abacosa onobrychioides", rightAnswer: false},
                {title: "Narth\u00e9cie des marais", subtitle: "Abama ossifraga", rightAnswer: true},
                {title: "AANarth\u00e9cie des marais", subtitle: "Abamaa ossifraga", rightAnswer: false}
            ]
        })
    }

    return plants
}


function Home(props) {
    const [plants, setPlants] = useState(createPlants())
    const [currentPlant, setCurrentPlant] = useState({})
    const [showQuiz, setShowQuiz] = useState(false)

     const handleCardClick = (e, plant) => {
        e.preventDefault()
        setCurrentPlant(plant)
        setShowQuiz(!showQuiz)
    }

    const handleQuizSubmit = (plant, value) => {
        let updatePlants = plants.map(p => {
            if (p.name === plant.name && !plant.found) {
                return {
                    ...p,
                    found: value
                }
            } else {
                return p;
            }
        })
        setPlants(updatePlants)
        console.log(plants)
    }

    return (
        <div className="fixed-container">
            <CardWrapper active={!showQuiz}>
                {plants.map((plant, index) => (
                    <FloatingPlantCard
                        key={plant.src}
                        index={index}
                        plant={plant}
                        handleClick={handleCardClick}
                    />
                ))}
                <div
                    className={css`
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      display: block;
                    `}
                >
                    <h1 className="main-title">Plantaludum</h1>
                    <ButtonLink label="Jouer" to="/connexion" size="ld" color="primary" fill={true}></ButtonLink>
                </div>
            </CardWrapper>
            <PlantQuiz show={showQuiz} setShow={setShowQuiz} plant={currentPlant} quizSubmit={handleQuizSubmit} />
        </div>
    );
}


export function CardWrapper({children, active}) {
    const ref = useRef(null)

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = e.clientX;
            const y = e.clientY;

            const xDecimal = x / window.innerWidth;
            const yDecimal = y / window.innerHeight;

            const maxX = ref.current?.offsetWidth - window.innerWidth;
            const maxY = ref.current?.offsetHeight - window.innerHeight;

            const panX = maxX * xDecimal * -1;
            const panY = maxY * yDecimal * -1;

            if (active) {
                ref.current.animate({
                    transform: `translate(${panX}px, ${panY}px)`
                }, {
                    duration: 4000,
                    fill: "forwards",
                    easing: "ease"
                })
            }
        }

        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [active])

    return (
       <div ref={ref} style={{
           width: "140vw",
           height: "160vh",
           top: 0,
           left: 0,
           position: "absolute",
           transition: "transform .3s cubic-bezier(.23,.74,.83,.83)"
       }}>
           {children}
       </div>
    );
}


export default Home;
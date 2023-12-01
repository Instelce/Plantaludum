import { useEffect, useRef, useState } from "react";
import { css } from "@emotion/css";
import FloatingPlantCard from "../components/FloatingPlantCard/index.jsx";
import { arrayChoice, deleteDublicates, getRandomInt } from "../utils/helpers";
import PlantQuiz from "../components/PlantQuiz/index.jsx";
import { apiFlore } from "../services/api/axios.js";
import { useQuery } from "@tanstack/react-query";
import { loadRandomPlants } from "../services/api";
import { PlantType } from "../services/api/types/plants";
import Button from "../components/ui/Buttons/Button";
import { Link } from "react-router-dom";
import {flore} from "../services/api/flore";

function Home(props) {
  let tempPlants: PlantType[] = [];
  const [plants, setPlants] = useState([]);
  const [currentPlant, setCurrentPlant] = useState({});
  const [showQuiz, setShowQuiz] = useState(false);

  const { isLoading, data: plantsData } = useQuery<PlantType[]>({
    queryKey: ["plants"],
    queryFn: async () => flore.plants.random(10),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!isLoading && plantsData) {
      // let tempPlants = []
      let col = -1;
      const size = 300;

      // loop 10 plants
      for (let i = 0; i < 10; i++) {
        let choices = [];
        let images = [];
        let plant = plantsData[i];
        // console.log(plant)

        apiFlore.get(`/api/images?plant__id=${plant.id}`).then((response) => {
          if (response.status === 200) {
            const allImages = response.data;
            // console.log(i, plant.id, allImages)
            // console.log(plant)

            // get images
            let randomImages = arrayChoice(
              allImages.results,
              allImages.count >= 8 ? 8 : allImages.count,
            );
            for (let id in randomImages) {
              if (randomImages[id]?.url) {
                images.push(randomImages[id].url);
              }
            }
            images = deleteDublicates(images);

            // console.log(images)

            // get choices
            let randomChoices = arrayChoice(plantsData, 2);

            let randomPlace = getRandomInt(0, randomChoices.length + 1);
            let id = 0;
            for (let i = 0; i < randomChoices.length + 1; i++) {
              if (i === randomPlace) {
                // console.log(i)
                choices.push({
                  title: plant.french_name
                    ? plant.french_name
                    : plant.correct_name,
                  subtitle: plant.scientific_name,
                  rightAnswer: true,
                });
              } else {
                console.log("aaa", randomChoices[id].french_name);
                if (randomChoices[id].french_name !== plant.french_name) {
                  choices.push({
                    title: randomChoices[id].french_name
                      ? randomChoices[id].french_name
                      : randomChoices[id].correct_name,
                    subtitle: randomChoices[id].scientific_name,
                    rightAnswer: false,
                  });
                  id++;
                }
              }
            }
            choices = deleteDublicates(choices);
            console.log(plant.french_name, choices);

            tempPlants.push({
              src: allImages.results[
                getRandomInt(0, allImages.results.length - 1)
              ]?.url,
              size: size,
              name: plant.french_name
                ? plant.french_name
                : plant.scientific_name,
              found: false,
              x: 20 * (i % 5) + 3,
              y:
                col === Math.ceil(10 / 2 / 2 - 1)
                  ? i % 2 === 0
                    ? getRandomInt(10, 15)
                    : getRandomInt(60, 70)
                  : i % 2 === 0
                    ? getRandomInt(10, 20)
                    : getRandomInt(50, 60),
              images: images,
              choices: choices,
            });

            if (tempPlants.length === 10) {
              setPlants(tempPlants);
            }
          }
        });
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (tempPlants.length === 10) {
      setPlants(tempPlants);
    }
  }, [tempPlants]);

  const handleCardClick = (e, plant) => {
    e.preventDefault();
    setCurrentPlant(() => plant);
    setShowQuiz(() => !showQuiz);
  };

  const handleQuizSubmit = (plant, value) => {
    let updatePlants = plants.map((p) => {
      if (p.name === plant.name && !plant.found) {
        return {
          ...p,
          found: value,
        };
      } else {
        return p;
      }
    });
    setPlants(updatePlants);
  };

  return (
    <div className="fixed-container">
      <CardWrapper active={!showQuiz}>
        {!isLoading &&
          plants.map((plant, index) => (
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
          <Button
            asChild
            label="Jouer"
            size="large"
            color="primary"
            fill={true}
          >
            <Link to="/connexion">Jouer</Link>
          </Button>
        </div>
      </CardWrapper>
      <PlantQuiz
        show={showQuiz}
        setShow={setShowQuiz}
        plant={currentPlant}
        handleQuizSubmit={handleQuizSubmit}
      />
    </div>
  );
}

export function CardWrapper({ children, active }) {
  const ref = useRef(null);

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
        ref.current.animate(
          {
            transform: `translate(${panX}px, ${panY}px)`,
          },
          {
            duration: 4000,
            fill: "forwards",
            easing: "ease",
          },
        );
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [active]);

  return (
    <div
      ref={ref}
      style={{
        width: "140vw",
        height: "160vh",
        top: 0,
        left: 0,
        position: "absolute",
        transition: "transform .3s cubic-bezier(.23,.74,.83,.83)",
      }}
    >
      {children}
    </div>
  );
}

export default Home;

import Navbar from "../components/Organisms/Navbar/Navbar";
import Button from "../components/Atoms/Buttons/Button";
import {Link} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {Query, useQuery, UseQueryResult} from "@tanstack/react-query";
import {flore} from "../services/api/flore";
import {getAnotherFormat} from "../utils/helpers";
import PlantImageSlider
  from "../components/Molecules/PlantImageSlider/PlantImageSlider";
import {CompletePlantImagesType} from "../services/api/types/plants";
import ChoiceBlock from "../components/Molecules/ChoiceBlock/ChoiceBlock";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";

function Home() {
  const plantsQuery = useQuery({
    queryKey: ["home-plants"],
    queryFn: () =>
      flore.plants.random({
        number: 30,
        params: {
          images: true,
        },
      }),
    staleTime: Infinity,
  });

  return (
    <div className="home">
      <Navbar.Root>
        <Navbar.Left>
          <Link to="/explorer">Explorer</Link>
        </Navbar.Left>

        <Navbar.Right>
          <Link to="/connexion">Connexion</Link>
          <Button asChild label="Inscription" size="large" color="gray">
            <Link
              to="/inscription"
              state={{from: {pathname: location.pathname}}}
            >
              S&apos;inscrire
            </Link>
          </Button>
        </Navbar.Right>
      </Navbar.Root>

      {plantsQuery.isSuccess && <>
        <HomeHeader plantsQuery={plantsQuery}/>
        <GameExplanationSection plantsQuery={plantsQuery}/>
        <DeckTestSection />
      </>}

    </div>
  );
}

function HomeHeader({plantsQuery}: { plantsQuery: UseQueryResult }) {
  const [plantsImagesData, setPlantsImagesData] = useState([]);
  const [imagesLoadedCount, setImagesLoadedCount] = useState(0);
  const plantsWallRef = useRef<HTMLDivElement>(null);

  // split data of plantsImagesQuery into 3 arrays of 10 plants images
  useEffect(() => {
    if (
      plantsQuery.isSuccess &&
      plantsQuery.data &&
      plantsImagesData.length === 0
    ) {
      const chunkSize = 10;
      for (let i = 0; i < plantsQuery.data?.length; i += chunkSize) {
        const chunk = [...plantsQuery.data!].slice(i, i + chunkSize);
        setPlantsImagesData((prev) => prev.concat([chunk]));
      }
    }
  }, [plantsQuery.isSuccess]);

  useEffect(() => {
    console.log(imagesLoadedCount);
  }, [imagesLoadedCount]);

  return (
    <>
      <header>
        {/* Plant wall */}
        <div className="plants-wall" ref={plantsWallRef}>
          {plantsImagesData.map((lines, i) => (
            <div
              key={i}
              className="line"
              style={{
                "--t": `${50 + i * 4}s`,
                "--r": i % 2 === 0 ? "reverse" : "normal",
              }}
            >
              {[0, 1].map((n) => (
                <div key={n} className="part">
                  {lines.map((plant) => {
                    let image = plant.images[0];
                    if (image) {
                      return (
                        <a
                          href={plant.eflore_url}
                          target="_blank"
                          rel="noreferrer"
                          key={image.id}
                          className="image-container"
                        >
                          <img
                            style={{
                              opacity: imagesLoadedCount >= 30 ? "1" : "0",
                            }}
                            src={getAnotherFormat(image.url, "CRS")}
                            alt={`Image de ${image.author}`}
                            onLoad={() =>
                              setImagesLoadedCount((prev) => prev + 1)
                            }
                          />
                          <small>Par {image.author}</small>
                        </a>
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Title */}
        <div className="content">
          <h1>Plantaludum</h1>
          <p>Un jeux pour découvrir et apprendre à reconnaitre les plantes !</p>
        </div>
      </header>
    </>
  );
}

function GameExplanationSection({
                                  plantsQuery,
                                }: {
  plantsQuery: UseQueryResult<CompletePlantImagesType[]>;
}) {
  const choiceBlocksContainer = useRef(null)
  const imagesSlider = useRef(null)

  // gsap animations
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".game-explanation", {
      scrollTrigger: {
        scroller: ".container",
        trigger: ".pinned",
        pin: true,
        pinSpacing: false,
        // scrub: 2,
        start: "top+=100px center",
        end: "bottom center",
        toggleActions: "start pause reverse pause",
        markers: true,
      },
      ease: "power1",
    });
  });

  useGSAP(() => {
    // image slider
    gsap.from(document.querySelector(".contents > .slider"), {
      scrollTrigger: {
        scroller: ".container",
        trigger: document.querySelector(".contents > .slider"),
        start: "top center",
        end: "center center",
        scrub: true,
        toggleActions: "restart pause pause reset",
        markers: {
          fontSize: "12px"
        },
      },
      opacity: 0,
      ease: "power1.inOut",
    })
  }, {dependencies: [imagesSlider.current]})

  useGSAP(() => {
    // choice blocks
    let choiceBlocks = document.querySelectorAll(".choice-block");
    gsap.from(choiceBlocks, {
      scrollTrigger: {
        scroller: ".container",
        trigger: document.querySelector(".choice-blocks-container"),
        start: "top center",
        end: "center center",
        toggleActions: "restart pause pause reset",
        markers: {
          fontSize: "12px"
        },
        scrub: 1,
      },
      stagger: .1,
      opacity: 0,
      ease: "power1.inOut",
    })
  }, {dependencies: [choiceBlocksContainer.current]})

  const plantData = plantsQuery.data!

  return (
    <section className="game-explanation">
      <div className="pinned">
        <h2>Le jeu !</h2>
        <p>
          Apprendre sous la forme d’un quiz. Vous avez plusieurs images d’une
          même plante et vous devez identifier quelle est le nom qui
          correspond dans une liste de choix.
        </p>
      </div>

      <div className="contents">
        <PlantImageSlider
          doRefresh={false}
          imagesData={plantData[0].images.splice(0, 5)}
          plantData={plantData[0]}
          ref={imagesSlider}
        />

        <div className="choice-blocks-container" style={{minHeight: "50vh"}} ref={choiceBlocksContainer}>
          {[...Array(6).keys()].map((i) => (
            <ChoiceBlock
              key={i}
              title={plantData[i].french_name}
              subtitle={plantData[i].scientific_name}
              isRightAnswer={i === 0}
              showResult={false}
              setShowResult={() => true}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function DeckTestSection() {

  return (
    <section>
    </section>
  )
}

export default Home;

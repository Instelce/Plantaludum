import {Link} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {useQuery, UseQueryResult} from "@tanstack/react-query";
import {flore} from "../services/api/flore";
import {getAnotherFormat} from "../utils/helpers";
import PlantImageSlider
  from "../components/Molecules/PlantImageSlider/PlantImageSlider";
import {CompletePlantImagesType,} from "../services/api/types/plants";
import ChoiceBlock from "../components/Molecules/ChoiceBlock/ChoiceBlock";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";
import DeckCard from "../components/Molecules/DeckCard/DeckCard";
import {decks} from "../services/api";
import {AsyncImage} from "../components/Atoms/Image/Image";

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
      {plantsQuery.isSuccess && (
        <>
          <HomeHeader plantsQuery={plantsQuery} />
          <GameExplanationSection plantsQuery={plantsQuery} />
          <DeckTestSection />
        </>
      )}

      <section className="simple-section">
        <div>
          <h2>D’où vient l’idée ?</h2>
          <p>
            Du jeu de Tela Botanica :{" "}
            <a
              href="https://theplantgame.com/"
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              theplantgame
            </a>
            , et d’une passion pour les plantes 😍.
          </p>
        </div>

        <img src="/theplantgame-screenshot.png" alt="theplantgame screenshot" />
      </section>

      <section className="simple-section">
        <div>
          <h2>Contribuez au projet</h2>
          <p>
            Le projet est{" "}
            <a
              href="https://github.com/Instelce/Plantaludum"
              className="link"
            >
              open source
            </a>
            . N’hésitez pas à venir contribuer, que ce soit dans le design ou
            dans le développement !
          </p>
        </div>

        <img src="/logos/github-logo.svg" alt="Github logo" />
      </section>

      <section className="thanks-section">
        <h2>Remerciements</h2>

        <div>
          <article>
            <div className="img-container">
              <img
                src="/logos/tela-botanica-logo.png"
                alt="Tela Botanica logo"
              />
            </div>
            <div>
              <h3>
                <a href="https://www.tela-botanica.org/">Tela Botanica</a>
              </h3>
              <p>
                Pour toutes les images et données sur les plantes (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.tela-botanica.org/flore/"
                  className="link"
                >
                  eFlore
                </a>
                ).
              </p>
            </div>
          </article>

          <article>
            <div className="img-container">
              <img src="/logos/kenney-logo.png" alt="Kenney logo" />
            </div>
            <div>
              <h3>
                <a href="https://www.kenney.nl/">Kenney</a>
              </h3>
              <p>Pour le son des boutons.</p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

function HomeHeader({ plantsQuery }: { plantsQuery: UseQueryResult<CompletePlantImagesType[]> }) {
  const [plantsImagesData, setPlantsImagesData] = useState<CompletePlantImagesType[][]>([]);
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
      for (let i = 0; i < plantsQuery.data.length; i += chunkSize) {
        const chunk = [...plantsQuery.data!].slice(i, i + chunkSize) as CompletePlantImagesType[];
        let line: CompletePlantImagesType[][] = [];
        line.push(chunk);
        setPlantsImagesData(prev => prev.concat(line));
      }
    }
  }, [plantsQuery.isSuccess]);

  return (
    <>
      <header>
        {/* Plant wall */}
        <div className="plants-wall" ref={plantsWallRef}>
          {[...plantsImagesData.slice(0, 3)].map((lines: CompletePlantImagesType[], i) => (
            <div
              key={i}
              className="line"
              style={{
                "--t": `${50 + i * 4}s`,
                "--r": i % 2 === 0 ? "reverse" : "normal",
              } as React.CSSProperties}
            >
              {[0].map((n) => (
                <div key={n} className="part">
                  {lines.map((plant: CompletePlantImagesType) => {
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
                          <AsyncImage
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
          <p>Un jeu pour découvrir et apprendre à reconnaitre les plantes !</p>
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
  const choiceBlocksContainer = useRef(null);
  const imagesSlider = useRef(null);

  // gsap animations
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".game-explanation", {
      scrollTrigger: {
        scroller: ".container",
        trigger: ".pinned",
        pin: true,
        pinSpacing: false,
        start: "top+=100px center",
        end: "bottom-=80px center",
        toggleActions: "start pause reverse pause",
      },
      ease: "power1",
    });
  });

  useGSAP(
    () => {
      // image slider
      gsap.from(document.querySelector(".contents > .slider"), {
        scrollTrigger: {
          scroller: ".container",
          trigger: document.querySelector(".contents > .slider"),
          start: "top-=20px center",
          end: "center center",
          scrub: true,
          toggleActions: "restart pause pause reset",
        },
        opacity: 0,
        ease: "power1.inOut",
      });
    },
    { dependencies: [imagesSlider.current] },
  );

  useGSAP(
    () => {
      // choice blocks
      let choiceBlocks = document.querySelectorAll(".choice-block");
      gsap.from(choiceBlocks, {
        scrollTrigger: {
          scroller: ".container",
          trigger: document.querySelector(".choice-blocks-container"),
          start: "top center",
          end: "center center",
          toggleActions: "restart pause pause reset",
          scrub: 1,
        },
        stagger: 0.1,
        opacity: 0,
        ease: "power1.inOut",
      });
    },
    { dependencies: [choiceBlocksContainer.current] },
  );

  const plantData = plantsQuery.data!;

  return (
    <section className="game-explanation">
      <div className="pinned">
        <h2>Le jeu !</h2>
        <p>
          Apprendre sous la forme d’un quiz. Vous avez plusieurs images d’une
          même plante et vous devez identifier quel est le nom qui correspond
          dans une liste de choix.
        </p>
      </div>

      <div className="contents">
        <PlantImageSlider
          doRefresh={false}
          imagesData={[...plantData[0].images].splice(0, 5)}
          plantData={plantData[0]}
          ref={imagesSlider}
        />

        <div
          className="choice-blocks-container"
          style={{ minHeight: "50vh" }}
          ref={choiceBlocksContainer}
        >
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
          <p>
            Double click sur une proposition pour voir si c&apos;est la bonne
            reponse.
          </p>
        </div>
      </div>
    </section>
  );
}

function DeckTestSection() {
  const decksQuery = useQuery({
    queryKey: ["home-decks"],
    queryFn: () =>
      decks.list({
        fieldFilters: {
          private: false,
        },
      }),
  });

  // Background effect
  useGSAP(() => {
    gsap.from(".background div", {
      scrollTrigger: {
        scroller: ".container",
        trigger: ".deck-test",
        start: "top center",
        end: "bottom center",
        scrub: true,
        toggleActions: "restart pause pause reset",
      },
      x: -200,
      ease: "none",
    });
  });

  return (
    <section className="deck-test">
      <div className="background">
        {[...Array(3).keys()].map((i) => (
          <div key={i}>
            {[...Array(20).keys()].map((j) => (
              <span key={j}></span>
            ))}
          </div>
        ))}
      </div>

      <div className="contents">
        <h2>Tu peux tester</h2>

        <div className="cards">
          {decksQuery.isSuccess && (
            <>
              {[...decksQuery.data.results].splice(0, 3).map((deck) => (
                <div key={deck.id} onClick={() => {}}>
                  <Link to={`/decks/${deck.id}/game/1`}>
                    <DeckCard.Root followMouse={false}>
                      <DeckCard.Header deck={deck} />
                    </DeckCard.Root>
                  </Link>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Home;

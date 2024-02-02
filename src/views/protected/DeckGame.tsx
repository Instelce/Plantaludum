import React, { useEffect, useRef, useState } from "react";
import ChoiceBlock from "../../components/Molecules/ChoiceBlock/ChoiceBlock";
import { Loader, RotateCcw, X } from "react-feather";
import { useTimer } from "../../hooks/useTimer.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import Stars from "../../components/Atoms/Stars/Stars";
import ProgressBar from "../../components/Atoms/ProrgessBar/ProgressBar";
import useDeck from "../../hooks/api/useDeck.js";
import {
  arrayChoice,
  deleteDublicates,
  shuffleArray,
} from "../../utils/helpers";
import useCacheImages from "../../hooks/useCacheImages.js";
import PlantImageSlider from "../../components/Molecules/PlantImageSlider/PlantImageSlider";
import Button from "../../components/Atoms/Buttons/Button";
import { PlantType } from "../../services/api/types/plants";
import { useMutation } from "@tanstack/react-query";
import { users } from "../../services/api/plantaludum";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch";
import useUser from "../../hooks/auth/useUser";
import { AxiosError } from "axios";
import { UserPlayedDeckType } from "../../services/api/types/decks";
import Header from "../../components/Molecules/Header/Header";
import { PlantImagesType } from "../../services/api/types/images";

function DeckGame() {
  const navigate = useNavigate();
  let { deckId, deckLevel } = useParams();
  const privateFetch = usePrivateFetch();
  const user = useUser();

  const scoreRightAnswer = 100;
  // const maxQuestions = 10 + parseInt(deckLevel) * 10;
  const maxQuestions = 3;

  const [showResult, setShowResult] = useState(false);
  const [isRight, setIsRight] = useState(undefined);
  const { formattedTime, seconds, start, reset } = useTimer({
    initialSeconds: 5 * 60,
  });
  const [userErrors, setUserErrors] = useState(0);

  const [isFisrtPlay, setIsFisrtPlay] = useState(false);

  // Stats
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [progress, setProgress] = useState(0);

  // plants and images management
  const [plantsData, setPlantsData] = useState<PlantType[] | null>(null);
  const [currentPlant, setCurrentPlant] = useState<PlantType | null>(null);
  const [currentImages, setCurrentImages] = useState(null);

  const { isLoading: imagesLoading, setImagesArray: setImagesArray } =
    useCacheImages();

  const deckContent = useRef(null);

  const { deckQuery, deckPlantsQuery, deckPlantsImagesQuery } = useDeck({
    deckId: deckId as string,
    fetchPlants: true,
    fetchImages: true,
  });

  const { mutate: mutateUserStats } = useMutation({
    mutationKey: ["user-stats"],
    mutationFn: ({ level, score }: { level: number; score: number }) =>
      users.update(privateFetch, user?.id as number, {
        level: level,
        score: score,
        games_played: (user?.games_played as number) + 1,
      }),
  });

  const userPlayedDeckQuery = useMutation<UserPlayedDeckType>({
    mutationKey: ["user-played-decks", deckId],
    mutationFn: () =>
      users.playedDecks.details(user?.id as number, parseInt(deckId as string)),
    onError: (err: Error) => {
      const e = err as AxiosError;
      if (e.response?.status === 500) {
        console.log("Le joueur n'a jamais joué ce deck");
        setIsFisrtPlay(true);
      }
    },
  });

  // Create or update the deck currently being played on UserPlayedDecks
  const { mutate: mutateCreatePlayedDeck } = useMutation({
    mutationKey: ["user-played-decks", deckId],
    mutationFn: () =>
      users.playedDecks.create(privateFetch, user?.id as number, {
        deck: parseInt(deckId as string),
        level: stars === 3 ? 2 : stars,
        current_stars: stars,
      }),
  });
  const { mutate: mutateUpdatePlayedDeckLevel } = useMutation({
    mutationKey: ["user-played-decks", deckId],
    mutationFn: ({
      level,
      current_stars,
    }: {
      level?: number;
      current_stars?: number;
    }) => {
      return users.playedDecks.update(
        privateFetch,
        user?.id as number,
        parseInt(deckId as string),
        { level: level, current_stars: current_stars },
      );
    },
  });

  useEffect(() => {
    if (user) {
      userPlayedDeckQuery.mutate();
    }
  }, [user]);

  // start the timer
  useEffect(() => {
    if (!imagesLoading) {
      start();
    }
  }, [imagesLoading]);

  // get new plant on start
  useEffect(() => {
    // console.log("start p");
    if (deckPlantsImagesQuery.isSuccess && deckPlantsQuery.isSuccess) {
      setPlantsData(() => deckPlantsQuery.data || []);
      const currentPlantData = arrayChoice(deckPlantsQuery.data || [])[0];
      setCurrentPlant(() => currentPlantData);
    }
  }, [
    deckPlantsQuery.isSuccess,
    deckPlantsImagesQuery.isSuccess,
    currentPlant,
    plantsData,
    deckPlantsQuery.data,
  ]);

  // load images in cache
  // useEffect(() => {
  //   if (deckPlantsImagesQuery.isSuccess) {
  //     setImagesArray(() =>
  //       Object.values(deckPlantsImagesQuery.data)
  //         .map((plants) => plants.images)
  //         .map((images) => images.map((img) => img.url))
  //         .flat(1),
  //     );
  //   }
  // }, [deckPlantsImagesQuery.data, deckPlantsImagesQuery.isSuccess]);

  // set images
  useEffect(() => {
    console.log("----", currentPlant?.french_name);
    if (currentPlant) {
      let tempImagesData: PlantImagesType[] =
        deckPlantsImagesQuery.data as PlantImagesType[];
      setCurrentImages(() =>
        shuffleArray(
          arrayChoice(
            deleteDublicates(
              Object.values(tempImagesData)
                ?.filter((v) => v.id === currentPlant.id)
                ?.map((v) => v.images)[0]
                ?.map((img) => img),
            ),
            5,
          ),
        ),
      );
      // console.log(currentImages)
    }
  }, [currentPlant, deckPlantsImagesQuery.data]);

  // is show results
  useEffect(() => {
    // reset values
    if (progress === 0) {
      setStars(0);
    }

    // set stars
    console.log("Erreur de l'utilisateur", userErrors, maxQuestions - progress);
    if (progress >= maxQuestions / 3 && userErrors < 2) {
      setStars(() => 1);
    }
    if (progress >= (maxQuestions / 3) * 2 && userErrors < 4) {
      setStars(() => 2);
    }
    if (progress >= maxQuestions && userErrors < 4) {
      setStars(() => 3);
      console.log("STARS", stars);
    }

    if (showResult && progress < maxQuestions) {
      let changeData = setTimeout(() => {
        // choose another images
        let lastPlant = currentPlant;
        let currentPlantData = arrayChoice(deckPlantsQuery.data || [])[0];
        if (lastPlant?.id === currentPlantData.id) {
          currentPlantData = arrayChoice(deckPlantsQuery.data || [])[0];
        }
        setCurrentPlant(() => currentPlantData);

        // shuffle plants
        setPlantsData((data) => shuffleArray(data));

        // update progress
        setProgress((p) => p + 1);
        setShowResult(false);
      }, 1000);

      return () => {
        clearTimeout(changeData);
      };
    }
  }, [
    currentPlant,
    deckPlantsQuery.data,
    progress,
    showResult,
    stars,
    userErrors,
  ]);

  useEffect(() => {
    // redirect to result page if deck is finished
    // or when time is finished
    if (progress === maxQuestions || seconds === 0) {
      console.log("Deck quiz finished");
      if (isFisrtPlay) {
        console.log("Create deck", stars);
        mutateCreatePlayedDeck();
      } else {
        console.log("Ok lets go");
        console.log("Update deck", stars);

        if (stars === 3) {
          console.log("................................");
          mutateUpdatePlayedDeckLevel({
            level: userPlayedDeckQuery.data?.level + 1,
            current_stars: 1,
          });
        } else {
          if (stars > userPlayedDeckQuery.data?.current_stars) {
            mutateUpdatePlayedDeckLevel({ current_stars: stars });
          }
        }
      }

      // update user stats
      if (user && userPlayedDeckQuery.data) {
        mutateUserStats({
          level: stars === 3 ? user.level + 1 : user.level,
          score: user.score + score,
        });
      }

      setTimeout(() => {
        navigate(`/decks/${deckId}/game/${deckLevel}/resultat`, {
          state: {
            data: {
              score: score,
              deck: deckQuery.data,
              level: deckLevel,
              stars: stars,
              times: formattedTime,
            },
          },
        });
      }, 2000);
    }
  }, [
    seconds,
    deckId,
    deckLevel,
    deckQuery.data,
    isFisrtPlay,
    mutateCreatePlayedDeck,
    mutateUpdatePlayedDeckLevel,
    navigate,
    progress,
    score,
    stars,
    userPlayedDeckQuery.data?.current_stars,
    userPlayedDeckQuery.data?.level,
  ]);

  // update score
  useEffect(() => {
    if (isRight !== undefined) {
      if (isRight) {
        setScore((score) => score + scoreRightAnswer);
      } else {
        setUserErrors((errors) => errors + 1);
      }

      // set stars
      let percent = (progress * 100) / maxQuestions;
      let progressStars;
      if (percent <= 33) {
        progressStars = 1;
      } else if (percent <= 66) {
        progressStars = 2;
      } else {
        progressStars = 3;
      }

      let userErrorStars;
      if (userErrors <= 5) {
        userErrorStars = 3;
      } else if (userErrors <= 10) {
        userErrorStars = 2;
      } else {
        userErrorStars = 1;
      }

      setStars(Math.min(progressStars, userErrorStars));

      setIsRight(undefined);
    }
  }, [isRight]);

  const resetQuiz = () => {
    reset();
    setProgress(0);
    setScore(0);
    setStars(0);
    setShowResult(false);
    setUserErrors(0);
  };

  return (
    <div className="deck-game-page">
      <Header.Root type="page">
        <div className="timer">
          <span>{formattedTime}</span>
          <RotateCcw onClick={() => resetQuiz()} />
        </div>
        <div className="stats">
          <Header.Title>{score}</Header.Title>
          <div className="stars-container">
            <Stars count={stars} />
          </div>
        </div>
        <Button asChild onlyIcon color="dark-gray" bounce={false}>
          <Link to={`/decks/${deckId}`}>
            <X />
          </Link>
        </Button>
      </Header.Root>

      <ProgressBar
        value={(progress * 100) / maxQuestions}
        color="rgb(var(--color-primary-light))"
        thickness="large"
        shape="square"
      />

      {!imagesLoading && (
        <div className="game-content">
          {/*<p>{currentPlant?.french_name}</p>*/}
          {currentImages && currentPlant && (
            <div className="game-grid" ref={deckContent}>
              {currentImages && (
                <PlantImageSlider
                  imagesData={currentImages}
                  plantData={currentPlant}
                />
              )}

              <div>
                {deckPlantsQuery.isSuccess ? (
                  <>
                    {plantsData?.map((plant, index) => (
                      <ChoiceBlock
                        key={plant.id}
                        index={index}
                        title={plant[
                          JSON.parse(
                            localStorage.getItem(
                              "settings.gameButtonInfo",
                            )! as string,
                          ).title as keyof PlantType
                        ].toString()}
                        subtitle={plant[
                          JSON.parse(
                            localStorage.getItem(
                              "settings.gameButtonInfo",
                            )! as string,
                          ).subtitle as keyof PlantType
                        ].toString()}
                        isRightAnswer={plant.id === currentPlant.id}
                        showResult={
                          plant.id === currentPlant.id ? showResult : false
                        }
                        setShowResult={setShowResult}
                        setIsRight={setIsRight}
                      />
                    ))}
                    <p>Double click sur la réponse de ton choix</p>
                  </>
                ) : (
                  <p>Fini !</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {imagesLoading && (
        <div className="center-loader">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default DeckGame;

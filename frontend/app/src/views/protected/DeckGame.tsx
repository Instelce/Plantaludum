import { useEffect, useRef, useState } from "react";
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
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { users } from "../../services/api/plantaludum/users";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch";
import useUser from "../../hooks/auth/useUser";
import { AxiosError } from "axios";
import { UserPlayedDeckType } from "../../services/api/types/decks";
import Header from "../../components/Molecules/Header/Header";
import { ImageType, PlantImagesType } from "../../services/api/types/images";
import { useAuth } from "../../context/AuthProvider";
import classNames from "classnames";
import {decks} from "../../services/api";

function DeckGame() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deckId = parseInt(useParams().deckId as string);
  const deckLevel = parseInt(useParams().deckLevel as string)
  const { accessToken } = useAuth();
  const privateFetch = usePrivateFetch();
  const user = useUser();

  const scoreRightAnswer = 100;
  const [maxQuestions, setMaxQuestions] = useState(
    10 + deckLevel * 5,
  );
  // const [maxQuestions, setMaxQuestions] = useState(3)

  // Update times played
  const updateTimesPlayed = useQuery({
    queryKey: ['update-times-played'],
    queryFn: () => decks.updateTimesPlated(deckId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  // Game variables
  const [showResult, setShowResult] = useState(false);
  const [isRight, setIsRight] = useState<boolean | undefined>(undefined);
  const { formattedTime, seconds, start, reset } = useTimer({
    initialSeconds: 5 * 60,
  });
  const [userErrors, setUserErrors] = useState(0);
  const [streak, setStreak] = useState({
    current: 0,
    last: 0,
    text: ""
  })

  const [isFisrtPlay, setIsFisrtPlay] = useState(false);

  // Stats
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [progress, setProgress] = useState(0);

  // plants and images management
  const [plantsData, setPlantsData] = useState<PlantType[] | null>(null);
  const [currentPlant, setCurrentPlant] = useState<PlantType | null>(null);
  const [currentImages, setCurrentImages] = useState<ImageType[] | null>(null);

  const { isLoading: imagesLoading, setImagesArray } =
    useCacheImages();

  const deckContent = useRef(null);

  const { deckQuery, deckPlantsQuery, deckPlantsImagesQuery } = useDeck({
    deckId: deckId,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const userPlayedDeckQuery = useMutation<UserPlayedDeckType>({
    mutationKey: ["user-played-decks", deckId.toString()],
    mutationFn: () =>
      users.playedDecks.details(user?.id as number, deckId),
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
    mutationKey: ["user-played-decks", deckId.toString()],
    mutationFn: ({level, current_stars}: {level: number, current_stars: number}) =>
      users.playedDecks.create(privateFetch, user?.id as number, {
        deck: deckId,
        level: level,
        current_stars: current_stars,
      }),
  });
  const { mutate: mutateUpdatePlayedDeckLevel } = useMutation({
    mutationKey: ["user-played-decks", deckId.toString()],
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
        deckId,
        { level: level, current_stars: current_stars },
      );
    },
  });

  useEffect(() => {
    if (user && accessToken) {
      userPlayedDeckQuery.mutate();
    } else {
      // if user is not connected
      setMaxQuestions(10);
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
  useEffect(() => {
    if (deckPlantsImagesQuery.isSuccess) {
      setImagesArray(() =>
        Object.values(deckPlantsImagesQuery.data)
          .map((plants) => plants.images)
          .map((images) => images.map((img) => img.url))
          .flat(1),
      );
    }
  }, [deckPlantsImagesQuery.data, deckPlantsImagesQuery.isSuccess]);

  // set images
  useEffect(() => {
    // console.log("----", currentPlant?.french_name);
    if (currentPlant) {
      let tempImagesData: PlantImagesType[] =
        deckPlantsImagesQuery.data as PlantImagesType[];
      setCurrentImages(() => {
        return shuffleArray(
          arrayChoice(
            deleteDublicates(
              Object.values(tempImagesData)
                ?.filter((v) => v.id === currentPlant.id)
                ?.map((v) => v.images)[0]
                ?.map((img) => img),
            ),
            5,
          ),
        );
      });
    }
  }, [currentPlant, deckPlantsImagesQuery.data]);

  // is show results
  useEffect(() => {
    // reset values
    if (progress === 0) {
      setStars(0);
    }

    // set stars
    // console.log("Erreur de l'utilisateur", userErrors, maxQuestions - progress);
    if (progress >= maxQuestions / 3 && userErrors < 2) {
      setStars(() => 1);
    }
    if (progress >= (maxQuestions / 3) * 2 && userErrors < 4) {
      setStars(() => 2);
    }
    if (progress >= maxQuestions && userErrors < 4) {
      setStars(() => 3);
      // console.log("STARS", stars);
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
        if (deckLevel === 3) {
          setPlantsData((data) => shuffleArray(data as any[]));
        }

        // update progress
        setProgress((p) => p + 1);
        setShowResult(false);
      }, 1100);

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
    // redirect to result page if progress is done
    // or when time is finished
    if (progress === maxQuestions || seconds === 0) {
      // console.log("Deck quiz finished");
      if (isFisrtPlay) {
        // console.log("Create deck", stars);
        mutateCreatePlayedDeck({
          level: stars === 3 ? 2 : 1,
          current_stars: stars
        });
      } else {
        //console.log("Ok lets go");
        //console.log("Update deck", stars);

        if (userPlayedDeckQuery.data) {
          if (stars === 3) {
            // console.log("................................");
            mutateUpdatePlayedDeckLevel({
              level: userPlayedDeckQuery.data.level + 1,
              current_stars: 1,
            });
          } else {
            if (stars > userPlayedDeckQuery.data.current_stars) {
              mutateUpdatePlayedDeckLevel({ current_stars: stars });
            }
          }
        }
      }

      // update user stats
      if (user) {
        mutateUserStats({
          level: stars === 3 ? user.level + 1 : user.level,
          score: user.score + score,
        });
      }

      // navigate and send game data to results page
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
    progress,
    score,
    stars,
    userPlayedDeckQuery.data?.current_stars,
    userPlayedDeckQuery.data?.level,
  ]);

  // update score, stars
  useEffect(() => {
    if (isRight !== undefined) {

      let currentStreak: number;

      if (isRight) {
        setScore((score) => score + scoreRightAnswer);
        currentStreak = streak.current + 1
        setStreak(streak => ({...streak, current: streak.current + 1}));
      } else {
        setUserErrors((errors) => errors + 1);
        currentStreak = 0
        setStreak(streak => ({...streak, last: 0, current: 0}));
      }

      console.log("s", streak);

      // streak
      if (currentStreak === 5) {
        setStreak(streak => ({...streak, last: streak.current, text: "+ 50 points"}));
        setScore((score) => score + 50);
      } else if (currentStreak === 10) {
        setStreak(streak => ({...streak, last: streak.current, text: "+ 100 points"}));
        setScore((score) => score + 100);
      } else if (currentStreak === 15) {
        setStreak(streak => ({...streak, last: streak.current, text: "+ 500 points"}));
        setScore((score) => score + 500);
      } else if (currentStreak === 20) {
        setStreak(streak => ({...streak, last: streak.current, text: "+ 1000 points"}));
        setScore((score) => score + 1000);
      } else if (currentStreak === 25) {
        setStreak(streak => ({...streak, last: streak.current, text: "+ 2000 points"}));
        setScore((score) => score + 2000);
      }

      console.log("e", streak, "\n");
      console.log();

      // set stars depending on progress and user errors
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
      if (userErrors <= maxQuestions / 5) {
        userErrorStars = 3;
      } else if (userErrors <= maxQuestions / 3) {
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
    setStreak({current: 0, last: 0, text: ""});
  };

  return (
    <div className="deck-game-page">
      <Header.Root type="page">
        <div className="timer">
          <span>{formattedTime}</span>
          <RotateCcw onClick={() => resetQuiz()}/>
        </div>
        <div className="stats">
          <div className="flex center">
            {/* <Header.Title>{streak.last} {streak.current} {score}</Header.Title> */}
            <Header.Title>{score}</Header.Title>

            {/* Streak text */}
            {/*<span*/}
            {/*  style={streak.current > 0 && streak.current === streak.last ? {animation: "show 4s ease forwards"} : {*/}
            {/*    opacity: 0,*/}
            {/*    maxWidth: "0",*/}
            {/*    maxHeight: "0"*/}
            {/*  }} className={classNames("streak-text")}>{streak.text}</span>*/}
          </div>
          <div className="stars-container">
            <Stars count={stars}/>
          </div>
        </div>
        <Button asChild onlyIcon color="dark-gray" bounce={false}>
          <Link to={`/decks/${deckId}`}>
            <X/>
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
          {currentImages && currentPlant && progress < maxQuestions && (
            <div className="game-grid" ref={deckContent}>
              {currentImages && (
                <PlantImageSlider
                  imagesData={currentImages}
                  plantData={currentPlant}
                />
              )}

              <div>
                {deckPlantsQuery.isSuccess && (
                  <>
                    {plantsData?.map((plant) => (
                      <ChoiceBlock
                        key={plant.id}
                        title={plant[
                        JSON.parse(
                          localStorage.getItem(
                            "settings.gameButtonInfo",
                          )! as string,
                        )?.title as keyof PlantType || "french_name"
                          ].toString()}
                        subtitle={plant[
                        JSON.parse(
                          localStorage.getItem(
                            "settings.gameButtonInfo",
                          )! as string,
                        )?.subtitle as keyof PlantType || "correct_name"
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
                )}
              </div>
            </div>
          )}

          {progress === maxQuestions &&
            <div className="content-container flex center">
              <h2 className="h4">Fini !</h2>
            </div>}
        </div>
      )}

      <div
        style={streak.current > 0 && streak.current === streak.last ? {animation: "streak-banner-show 1.6s ease forwards"} : {
          opacity: 0,
        }} className={classNames("streak-banner")}>{streak.current} bonne réponses d&apos;affilé, {streak.text}</div>

      {imagesLoading && (
        <div className="center-loader">
          <Loader/>
        </div>
      )}
    </div>
  );
}

export default DeckGame;

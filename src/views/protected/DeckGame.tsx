import React, {useEffect, useRef, useState} from "react";
import ChoiceBlock from "../../components/ChoiceBlock/ChoiceBlock";
import {Loader, RefreshCw, X} from "react-feather";
import {useTimer} from "../../hooks/useTimer.js";
import {Link, useNavigate, useParams} from "react-router-dom";
import Stars from "../../components/ui/Stars/Stars";
import ProgressBar from "../../components/ProrgessBar/ProgressBar";
import useDeck from "../../hooks/api/useDeck.js";
import {
  arrayChoice,
  deleteDublicates,
  shuffleArray,
} from "../../utils/helpers";
import useCacheImages from "../../hooks/useCacheImages.js";
import PlantImageSlider
  from "../../components/PlantImageSlider/PlantImageSlider";
import Button from "../../components/ui/Buttons/Button";
import {PlantType} from "../../services/api/types/plants";
import {useMutation} from "@tanstack/react-query";
import {users} from "../../services/api/plantaludum";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch";
import useUser from "../../hooks/auth/useUser";
import {AxiosError} from "axios";
import {UserPlayedDeckType} from "../../services/api/types/decks";

function DeckGame() {
  const navigate = useNavigate();
  let { deckId } = useParams();
  const privateFetch = usePrivateFetch();
  const user = useUser()

  const scoreRightAnswer = 100
  const maxQuestions = 5;

  const [showResult, setShowResult] = useState(false);
  const [isRight, setIsRight] = useState(undefined);
  const { stringTime, start, reset } = useTimer({ startValue: 5 });
  const [userErrors, setUserErrors] = useState(0);

  const [isFisrtPlay, setIsFisrtPlay] = useState(false)

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

  const userPlayedDeckQuery = useMutation<UserPlayedDeckType>({
    mutationKey: ["user-played-decks", deckId],
    mutationFn: () => users.playedDecks.details(user?.id as number, parseInt(deckId as string)),
    onError: (err: AxiosError) => {
      if (err.response?.status === 500) {
        console.log("Le joueur n'a jamais joué ce deck")
        setIsFisrtPlay(true)
      }
    }
  })

  const {mutate: mutateCreatePlayedDeck} = useMutation({
    mutationKey: ["user-played-decks", deckId],
    mutationFn: () => users.playedDecks.create(privateFetch, user?.id as number, {deck: parseInt(deckId as string)}),
  })
  const {mutate: mutateUpdatePlayedDeckLevel} = useMutation({
    mutationKey: ["user-played-decks", deckId],
    mutationFn: () => users.playedDecks.update(privateFetch, user?.id as number, parseInt(deckId as string), {level: userPlayedDeckQuery.data.level + 1}),
  })

  useEffect(() => {
    if (user) {
      userPlayedDeckQuery.mutate()
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
    console.log("start p");
    if (deckPlantsImagesQuery.isSuccess && deckPlantsQuery.isFetched) {
      setPlantsData(() => deckPlantsQuery.data ||[]);
      const currentPlantData = arrayChoice(deckPlantsQuery.data || [])[0];
      setCurrentPlant(() => currentPlantData);
    }
  }, [
    deckPlantsQuery.isSuccess,
    deckPlantsImagesQuery.isSuccess,
    currentPlant,
    plantsData,
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
  }, [deckPlantsImagesQuery.isSuccess]);

  // set images
  useEffect(() => {
    console.log("id", currentPlant?.scientific_name)
    if (currentPlant) {
      let tempImagesData = deckPlantsImagesQuery.data;
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

      console.log(currentImages);
    }
  }, [currentPlant]);

  // is show results
  useEffect(() => {
    // reset values
    if (progress === 0) {
      setStars(0);
    }

    // set stars
    console.log("Erreur de l'utilisateur", userErrors, maxQuestions - progress);
    if (progress >= maxQuestions / 3 && userErrors < 2) {
      setStars(1)
    }
    if (progress >= ( maxQuestions / 3 ) * 2 && userErrors < 4) {
      setStars(2)
    }
    if (progress >= maxQuestions && userErrors < 4) {
      setStars(3)
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

    // redirect to result page if deck is finished
    if (progress === maxQuestions - 1) {
      if (isFisrtPlay) {
        mutateCreatePlayedDeck()
      } else {
        if (stars === 3) {
          mutateUpdatePlayedDeckLevel()
        }
      }
      setTimeout(() => {
        navigate(`/decks/${deckId}/game/resultat`, {replace: true});
      }, 2000);
    }
  }, [showResult]);

  // update score
  useEffect(() => {
    if (isRight !== undefined) {
      if (isRight) {
        setScore(score => score + scoreRightAnswer);
      } else {
        setUserErrors(errors => errors + 1);
      }
      setIsRight(undefined);
    }
  }, [isRight]);

  const resetQuiz = () => {
    reset();
    setProgress(0);
    setScore(0)
    setStars(0)
    setShowResult(false);
    setUserErrors(0)
  };

  return (
    <div className="deck-game-page">
      {/*<Navbar >*/}
      {/*  <div className="left">*/}
      {/*    <Link to="/mon-jardin">Mon jardin</Link>*/}
      {/*    <Link to="/explorer">Explorer</Link>*/}
      {/*  </div>*/}
      {/*  <div className="right">*/}
      {/*  </div>*/}
      {/*</Navbar>*/}

      <header className="page-header">
        <div className="timer">
          <span>{stringTime}</span>
          <RefreshCw onClick={() => resetQuiz()} />
        </div>
        <div className="stats">
          <h1>{score}</h1>
          <div className="stars-container">
            <Stars count={stars} />
          </div>
        </div>
        <Button asChild onlyIcon color="dark-gray" bounce={false}>
          <Link to={`/decks/${deckId}`}>
            <X />
          </Link>
        </Button>
      </header>

      <ProgressBar
        value={(progress * 100) / maxQuestions}
        color="rgb(var(--color-primary-light))"
        thickness="large"
        shape="square"
      />

      {!imagesLoading && <div className="game-content">
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
                      title={plant.french_name}
                      subtitle={plant.scientific_name}
                      isRightAnswer={plant.id === currentPlant.id}
                      showResult={showResult}
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
      </div>}

      {imagesLoading && <div className="center-loader"><Loader /></div>}
    </div>
  );
}

export default DeckGame;

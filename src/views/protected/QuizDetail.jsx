import {useMutation, useQueries, useQuery} from "@tanstack/react-query";
import {useParams} from "react-router-dom";
import {loadPlants, loadQuiz, loadQuizPlants} from "../../api/api.js";
import Loader from "../../components/Loader/index.jsx";
import ButtonLink from "../../components/Buttons/ButtonLink.jsx";
import {ArrowRight, EyeOff, RefreshCcw, Trash2} from "react-feather";
import Button from "../../components/Buttons/Button.jsx";
import Stars from "../../components/Stars/index.jsx";
import {useEffect} from "react";
import ListItem from "../../components/ListItem/index.jsx";


function QuizDetail(props) {

  const {quizId} = useParams()

  const [quizQuery, quizPlantsQuery] = useQueries({
    queries: [
      {
        queryKey: ['quizzes', quizId],
        queryFn: () => loadQuiz(quizId),
        staleTime: 30_000
      },
      {
        queryKey: ['quizzes-plants'],
        queryFn: () => loadQuizPlants({quiz__id: quizId}),
        staleTime: 30_000
      }
    ]
  })

  const {isSuccess: plantsSuccess,mutate: mutatePlants, data: plantsData} = useMutation({
    mutationKey: ['plants'],
    mutationFn: () => loadPlants({
      list: Object.values(quizPlantsQuery.data).map(v => v.plant_id)
    }),
    onError: (error) => {
      console.log(error)
    }
  })

  useEffect(() => {
    if (quizPlantsQuery.isSuccess) {
      mutatePlants()
    }
  }, [quizPlantsQuery.isSuccess]);

  return (
    <div className="quiz-detail">
      {quizQuery.isSuccess && <>
        <div>
          <div className="img-container">
            <img src={quizQuery.data.preview_image_url} alt="Preview image"/>
          </div>

          <ButtonLink
            to="quiz/"
            label="Jouer"
            color="primary"
            icon={<ArrowRight />}
            fill
          />

          <ButtonLink
            to="quiz/"
            label="Mettre à jour"
            color="secondary"
            icon={<RefreshCcw />}
            fill
          />

          <Button
            label="Supprimer"
            color="danger"
            icon={<Trash2 />}
            fill
          />
        </div>

        <div>
          <div className="header">
            <div className="title">
              <h1>{quizQuery.data.name}</h1>
              {quizQuery.data.private && <EyeOff />}
            </div>

            <Stars count={quizQuery.data.difficulty} />

            <p>
              {quizQuery.data.description}
            </p>
          </div>

          <div className="plants-container">
            <h2>Plantes</h2>

            {plantsSuccess && <>

              {plantsData.results.map((plant, index) => (
                <ListItem key={plant.id} index={index} title={plant.french_name} />
              ))}

            </>}
          </div>
        </div>
      </>}

      {quizQuery.isLoading && <Loader />}
    </div>
  );
}

export default QuizDetail;
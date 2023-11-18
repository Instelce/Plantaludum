import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import {useLocation, useParams} from "react-router-dom";
import {
  loadPlantsIdsList,
  loadPlants,
  loadQuiz,
  loadQuizPlants, loadPlantsIdsListImages
} from "../../api/api.js";
import Loader from "../../components/Loader/index.jsx";
import ButtonLink from "../../components/Buttons/ButtonLink.jsx";
import {ArrowRight, EyeOff, RefreshCcw, Trash2} from "react-feather";
import Button from "../../components/Buttons/Button.jsx";
import Stars from "../../components/Stars/index.jsx";
import {useEffect} from "react";
import ListItem from "../../components/ListItem/index.jsx";
import useQuiz from "../../hooks/api/useQuiz.js";
import {getObjectKeyValues} from "../../utils.js";


function QuizDetail(props) {

  const {quizId} = useParams()

  const {
    quizQuery,
    quizPlantsQuery
  } = useQuiz({
     quizId,
    fetchPlants: true,
  })

  return (
    <div className="quiz-detail">
      {quizQuery.isSuccess && <>
        <div>
          <div className="img-container">
            <img src={quizQuery.data.preview_image_url} alt="Preview image"/>
          </div>

          <ButtonLink
            to={`/quiz/${quizId}/game`}
            label="Jouer"
            color="primary"
            icon={<ArrowRight />}
            fill
          />

          <ButtonLink
            to={`/quiz/${quizId}/update`}
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

            {quizPlantsQuery.isSuccess && <>

              {quizPlantsQuery.data.map((plant, index) => (
                <ListItem key={plant.id} index={index} title={plant.french_name} />
              ))}

            </>}

            {quizPlantsQuery.isLoading && <Loader />}
          </div>
        </div>
      </>}

      {quizQuery.isLoading && <Loader />}
    </div>
  );
}

export default QuizDetail;
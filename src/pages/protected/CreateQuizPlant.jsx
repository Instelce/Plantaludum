import {useParams} from "react-router-dom";

function CreateQuizPlant(props) {
  const {quizId} = useParams()

  return (
    <div className="container center">
      <form className="form-page">
        <div className="form-header">
          <h1>Creation des plants du quiz {quizId}</h1>
        </div>
      </form>
    </div>
  );
}

export default CreateQuizPlant;
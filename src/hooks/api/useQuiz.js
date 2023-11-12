import {useQueries, useQuery} from "@tanstack/react-query";
import {
  loadPlantsIdsList,
  loadPlantsIdsListImages,
  loadQuiz,
  loadQuizPlants
} from "../../api/api.js";
import {useEffect} from "react";
import {getObjectKeyValues} from "../../utils.js";


function useQuiz ({
  quizId,
  fetchPlants = false,
  fetchImages = false
}) {
  const [quizQuery, quizPlantsQuery] = useQueries({
    queries: [
      {
        queryKey: ['quizzes', quizId],
        queryFn: () => loadQuiz(quizId),
        staleTime: 30_000
      },
      {
        queryKey: ['quizzes-plants', quizId],
        queryFn: () => loadQuizPlants({quiz__id: quizId}),
      }
    ]
  })

  const plantsQuery = useQuery({
    queryKey: ['plants', quizId],
    queryFn: () => loadPlantsIdsList(
      getObjectKeyValues(quizPlantsQuery.data, 'plant_id') // array of plant id
    ),
    onError: (error) => {
      console.log(error)
    },
    enabled: false
  })

  const plantsImagesQuery = useQuery({
    queryKey: ['plants-images', quizId],
    queryFn: () => loadPlantsIdsListImages(
      getObjectKeyValues(quizPlantsQuery.data, 'plant_id')
    ),
    enabled: false
  })

  // fetch quiz plants
  useEffect(() => {
    if (quizPlantsQuery.isSuccess && fetchPlants) {
      plantsQuery.refetch()
    }
  }, [quizPlantsQuery.isSuccess]);

  // fetch plants images
  useEffect(() => {
    if (plantsQuery.isSuccess && fetchImages) {
      plantsImagesQuery.refetch()
    }
  }, [plantsQuery.isSuccess]);

  return {
    quizQuery: quizQuery,
    quizPlantsQuery: plantsQuery | null,
    quizPlantsImagesQuery: plantsImagesQuery | null,
  }
}


export default useQuiz;
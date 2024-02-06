import React from "react";
import Header from "../../components/Molecules/Header/Header";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import useUser from "../../hooks/auth/useUser";
import identifications from "../../services/api/plantaludum/identifications";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch";
import {flore} from "../../services/api/flore";
import {getAnotherFormat, getCurrentTime} from "../../utils/helpers";
import SingleImage
  from "../../components/Molecules/SingleImage/SingleImage/SingleImage";
import {useNavigate} from "react-router-dom";
import Button from "../../components/Atoms/Buttons/Button";
import {Trash} from "react-feather";
import {IdentificationType} from "../../services/api/types/identifications";


function Identifications() {
  const user = useUser();
  const privateFetch = usePrivateFetch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const userIdentificationsQuery = useQuery({
    queryKey: ["user-identifications"],
    queryFn: () => identifications.list(privateFetch, user?.id as number),
    enabled: user != null,
  });

  const identificationsImageQuery = useQuery({
    queryKey: ["identifications-image"],
    queryFn: () =>
      flore.images.getWithIds(
        userIdentificationsQuery.data?.map((identification) => {
          return identification.image_id;
        }) as number[],
      ),
    enabled: userIdentificationsQuery.data != null,
  });

  const answeredIdentificationsPlantQuery = useQuery({
    queryKey: ["identifications-answered-plants"],
    queryFn: () =>
      flore.plants.getWithIds(
        userIdentificationsQuery.data?.map((identification) => {
          return identification.plant_id;
        }) as number[],
      ),
    enabled: userIdentificationsQuery.data != null,
  })

  const {mutate: mutateDeleteIdentification} = useMutation({
    mutationKey: ["delete-identification"],
    mutationFn: (identificationId: number) =>
      identifications.delete(privateFetch, identificationId),
    onMutate: async (identificationId: number) => {
      await queryClient.cancelQueries({queryKey: ["user-identifications"]})
      const previousIdentifications = queryClient.getQueryData(["user-identifications"]) as IdentificationType[]
      queryClient.setQueryData(["user-identifications"], (old: IdentificationType[]) => old.filter(t => t.id != identificationId))
      return {
        previousIdentifications: previousIdentifications,
        deleted: previousIdentifications.filter(t => t.id === identificationId)[0]
      }
    },
    onError: (err, identificationId, context) => {
      queryClient.setQueryData(["user-identifications"], context.previousIdentifications)
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ["user-identifications"]})
    },
  });

  const userIdentificationsData = userIdentificationsQuery.data?.filter(i => i.answer === -1) || []
  const identificationsImageData = identificationsImageQuery.data || []
  const userIdentificationAnswersData = userIdentificationsQuery.data?.filter(i => i.answer != -1) || []
  const userIdentificationAnswersFilteredByPlantData = userIdentificationAnswersData.reduce(function(a, e) {
    let key = (e['plant_id']);
    (a[key] ? a[key] : (a[key] = null || [])).push(e);
    return a;
  }, {});

  console.log(Object.entries(userIdentificationAnswersFilteredByPlantData))

  return (
    <div className="identifications-page">
      <Header.Root type="page" center>
        <div className="center f-col">
          <span>Prochaine assignation</span>
          <Header.Title>
            {getCurrentTime().hour} : {getCurrentTime().minute} :{" "}
            {getCurrentTime().second}
          </Header.Title>
        </div>
      </Header.Root>

      <Header.Root type="sub-section">
        <Header.Title>A identifier</Header.Title>
      </Header.Root>

      <div className="grid gc-4 gg-2 content-container">
        {identificationsImageData.length > 0 && userIdentificationsData.length > 0 && <>
          {userIdentificationsData.map((identification, index) => {
            let image = identificationsImageData.filter(i => i.id === identification.image_id)[0];
            return <SingleImage.Root
              key={identification.id}
              onClick={() => {
                navigate(`/identifications/${userIdentificationsData[index].id}`, {
                  state: {
                    data: {
                      identification:
                        userIdentificationsData[index],
                      image: image,
                    },
                  }
                })
              }}
              image={{...image, url: getAnotherFormat(image.url, "CRS")}}
              isClickable
            >
              <SingleImage.Down paddingVertical={0} paddingHorizontal={0}>
                <div className="identification-index">
                  <h4 className="h4">{index + 1}</h4>
                </div>
                <Button
                  onlyIcon
                  color="danger"
                  className="delete"
                  onClick={() => {
                    mutateDeleteIdentification(
                      identification.id,
                    )
                  }}
                >
                  <Trash/>
                </Button>
              </SingleImage.Down>
            </SingleImage.Root>
          })}
        </>}

        {/* No data */}
        {userIdentificationsData.length === 0 &&
          <div className="center fill-horizontal">
            <p>Aucune plante à assigner, veuillez attendre la prochaine
              assignation.</p>
          </div>}
      </div>

      {userIdentificationAnswersData.length > 0 && identificationsImageData.length > 0 && <div>
        <Header.Root type="sub-section">
          <Header.Title>Corrigées</Header.Title>
        </Header.Root>

        <div className="grid gc-4 gg-2 content-container">
          {Object.entries(userIdentificationAnswersFilteredByPlantData).map((plantGroup) => {
            let plantId = plantGroup[0];
            let answers = plantGroup[1] as IdentificationType[];
            let imageId = answers[0].image_id;
            let image = identificationsImageData.filter(i => i.id === imageId)[0]
            let badAnswer = answers.filter(i => i.answer !== i.plant_id);
            let goodAnswer = answers.filter(i => i.answer === i.plant_id);

            console.log(answers, goodAnswer, badAnswer)

            return (
              <>
                <SingleImage.Root image={image}>
                  <SingleImage.Up>
                    {goodAnswer.length}
                  </SingleImage.Up>
                  <SingleImage.Down>
                    {badAnswer.length}
                  </SingleImage.Down>
                </SingleImage.Root>
              </>
            )
          })}
        </div>
      </div>}
    </div>
  );
}

export default Identifications;

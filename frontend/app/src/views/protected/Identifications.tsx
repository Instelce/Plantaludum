import {useEffect, useMemo, useState} from "react";
import Header from "../../components/Molecules/Header/Header";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import useUser from "../../hooks/auth/useUser";
import identifications from "../../services/api/plantaludum/identifications";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch";
import {flore} from "../../services/api/flore";
import {
  deleteDublicates,
  getAnotherFormat,
  numberWithZero,
} from "../../utils/helpers";
import SingleImage
  from "../../components/Molecules/SingleImage/SingleImage/SingleImage";
import {Link, useNavigate} from "react-router-dom";
import Button from "../../components/Atoms/Buttons/Button";
import {Trash} from "react-feather";
import {IdentificationType} from "../../services/api/types/identifications";
import SectionLoader
  from "../../components/Molecules/SectionLoader/SectionLoader";

function Identifications() {
  const user = useUser();
  const privateFetch = usePrivateFetch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const userPlayedDecks: [] | undefined = queryClient.getQueryData(["user-played-decks"])

  const userIdentificationsQuery = useQuery({
    queryKey: ["user-identifications"],
    queryFn: () => identifications.list(privateFetch, user?.id as number),
    enabled: (user !== null && user !== undefined),
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
        deleteDublicates(
          userIdentificationsQuery.data?.map((identification) => {
            return identification.plant_id;
          }) as [],
        ) as number[],
      ),
    enabled: userIdentificationsQuery.data != null,
  });

  const {mutate: mutateDeleteIdentification} = useMutation({
    mutationKey: ["delete-identification"],
    mutationFn: (identificationId: number) =>
      identifications.delete(privateFetch, identificationId),
    onMutate: async (identificationId: number) => {
      await queryClient.cancelQueries({queryKey: ["user-identifications"]});
      const previousIdentifications = queryClient.getQueryData([
        "user-identifications",
      ]) as IdentificationType[];
      queryClient.setQueryData(
        ["user-identifications"],
        (old: IdentificationType[]) =>
          old.filter((t) => t.id != identificationId),
      );
      return {
        previousIdentifications: previousIdentifications,
        deleted: previousIdentifications.filter(
          (t) => t.id === identificationId,
        )[0],
      };
    },
    onError: (err, identificationId, context) => {
      queryClient.setQueryData(
        ["user-identifications"],
        context?.previousIdentifications,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ["user-identifications"]});
    },
  });

  // separate answered identification to not answered identifications
  const userIdentificationsData = useMemo(() => {
    if (userIdentificationsQuery.data) {
      return userIdentificationsQuery.data?.filter((i) => i.answer === -1);
    } else {
      return []
    }
  }, [userIdentificationsQuery.data]);

  const userIdentificationAnswersData = useMemo(() => {
    if (userIdentificationsQuery.data) {
      return userIdentificationsQuery.data?.filter((i) => i.answer != -1);
    } else {
      return []
    }
  }, [userIdentificationsQuery.data]);

  // filter all the identifications answers by group of plant
  const userIdentificationAnswersFilteredByPlantData = useMemo(() => {
    return userIdentificationAnswersData.reduce(function (a, e) {
      let key = e["plant_id"];
      (a[key] ? a[key] : (a[key] = null || []) as any).push(e);
      return a;
    }, {} as { [key: number]: any[] });
  }, [userIdentificationAnswersData]);

  // useEffect(() => {
  //   if (timer.hours == 0 && timer.minutes == 0 && timer.seconds == 0) {
  //     userIdentificationsQuery.refetch()
  //     identificationsImageQuery.refetch()
  //   }
  // }, [timer]);

  // console.log(Object.entries(userIdentificationAnswersFilteredByPlantData))

  return (
    <div className="identifications-page">
      <IdentificationHeader/>

      <Header.Root type="sub-section">
        <Header.Title>A identifier</Header.Title>
      </Header.Root>

      <SectionLoader isLoading={userIdentificationsQuery.isLoading}/>

      <div className="grid gc-4 gg-2 content-container">
        {userIdentificationsQuery.isSuccess && identificationsImageQuery.data && (
          <>
            {userIdentificationsData.map((identification, index) => {
              let image = identificationsImageQuery.data.filter(
                (i) => i.id === identification.image_id,
              )[0];
              return (
                <SingleImage.Root
                  key={identification.id}
                  onClick={() => {
                    navigate(
                      `/identifications/${userIdentificationsData[index].id}`,
                      {
                        state: {
                          data: {
                            identification: userIdentificationsData[index],
                            image: image,
                          },
                        },
                      },
                    );
                  }}
                  image={{
                    ...image,
                    url: getAnotherFormat(image.url, "CRS"),
                  }}
                  isClickable
                >
                  <SingleImage.Down>
                    <div className="identification-index">
                      <h4 className="h4">{index + 1}</h4>
                    </div>
                    <Button
                      onlyIcon
                      title="Supprimer l'identification"
                      color="danger"
                      className="delete"
                      onClick={() => {
                        mutateDeleteIdentification(identification.id);
                      }}
                    >
                      <Trash/>
                    </Button>
                  </SingleImage.Down>
                </SingleImage.Root>
              );
            })}
          </>
        )}

        {/* No data */}
        {userIdentificationsData.length === 0 &&
          userIdentificationsQuery.isSuccess && (
            <div className="center fill-horizontal">
              {/* User hasn't play a deck */}
              {userPlayedDecks && userPlayedDecks.length === 0 ?
                <p><Link to="/explorer" className="link">Jouer à un
                  deck</Link> pour pouvoir avoir des identifications.
                </p> :
                <p>
                  Aucune plante à assigner, veuillez attendre la prochaine
                  assignation.
                </p>}


            </div>
          )}
      </div>

      {userIdentificationAnswersData.length > 0 &&
        answeredIdentificationsPlantQuery.data &&
        identificationsImageQuery.data && (
          <div>
            <Header.Root type="sub-section">
              <Header.Title>Corrigées</Header.Title>
            </Header.Root>

            <div className="grid gc-4 gg-2 content-container">
              {Object.entries(userIdentificationAnswersFilteredByPlantData).map(
                (plantGroup) => {
                  // get plant data
                  let plantId = parseInt(plantGroup[0]);
                  let plantName = answeredIdentificationsPlantQuery.data.filter(
                    (plant) => plant.id === plantId,
                  )[0].french_name;

                  // answered identifications
                  let answers = plantGroup[1] as IdentificationType[];
                  let imageId = answers[0].image_id;
                  let image = identificationsImageQuery.data.filter(
                    (i) => i.id === imageId,
                  )[0];

                  // count bad and good answer
                  let badAnswer = answers.filter(
                    (i) => i.answer !== i.plant_id,
                  ).length;
                  let goodAnswer = answers.filter(
                    (i) => i.answer === i.plant_id,
                  ).length;

                  return (
                    <>
                      <SingleImage.Root key={plantId} image={image}
                                        imageFormat="CRS">
                        {goodAnswer > 0 && (
                          <SingleImage.Up>
                            <span className="good-answers">{goodAnswer}</span>
                          </SingleImage.Up>
                        )}

                        <SingleImage.Down className="bottom">
                          <p>{plantName}</p>
                          {badAnswer > 0 && (
                            <span className="bad-answers">{badAnswer}</span>
                          )}
                        </SingleImage.Down>
                      </SingleImage.Root>
                    </>
                  );
                },
              )}
            </div>
          </div>
        )}
    </div>
  );
}

function IdentificationHeader() {
  // assignment timer
  const [timer, setTimer] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      let date = new Date();
      setTimer({
        hours: date.getHours() % 2 == 0 ? 1 : 0,
        minutes: 59 - date.getMinutes(),
        seconds: 59 - date.getSeconds(),
      });
    }, 1000);

    return () => clearTimeout(interval);
  }, []);
  return (
    <>
      <Header.Root type="page" center>
        <div className="center f-col">
          <span>Prochaine assignation</span>
          <Header.Title>
            {numberWithZero(timer.hours)} : {numberWithZero(timer.minutes)} :{" "}
            {numberWithZero(timer.seconds)}
          </Header.Title>
        </div>
      </Header.Root>
    </>
  )
}

export default Identifications;

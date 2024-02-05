import React, {useEffect, useReducer, useState} from "react";
import Header from "../../components/Molecules/Header/Header";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import useUser from "../../hooks/auth/useUser";
import identifications from "../../services/api/plantaludum/identifications";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch";
import {flore} from "../../services/api/flore";
import {getAnotherFormat, getCurrentTime} from "../../utils/helpers";
import SingleImage
  from "../../components/Molecules/SingleImage/SingleImage/SingleImage";
import {Link, Navigate, useLocation, useNavigate} from "react-router-dom";
import Button from "../../components/Atoms/Buttons/Button";
import {Trash} from "react-feather";
import useForceUpdate from "../../hooks/useForceUpdate";
import {IdentificationType} from "../../services/api/types/identifications";
import {ImageType} from "../../services/api/types/images";


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

  const {mutate: mutateDeleteIdentification} = useMutation({
    mutationKey: ["delete-identification"],
    mutationFn: (identificationId: number) =>
      identifications.delete(privateFetch, identificationId),
    onMutate: async (identificationId: number) => {
      await queryClient.cancelQueries({queryKey: ["user-identifications"]})
      const previousIdentifications = queryClient.getQueryData(["user-identifications"])
      queryClient.setQueryData(["user-identifications"], (old: IdentificationType[]) => old.filter(t => t.id != identificationId))
      // queryClient.setQueryData(["identifications-image"], (old: ImageType[]) => old.filter(t => t.plant_id != userIdentificationsData[identificationId].plant_id))
      return {previousIdentifications: previousIdentifications, deleted: previousIdentifications.filter(t => t.id === identificationId)[0]}
    },
    onError: (err, identificationId, context) => {
      queryClient.setQueryData(["user-identifications"], context.previousIdentifications)
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ["user-identifications"]})
    },
  });

  const userIdentificationsData = userIdentificationsQuery.data || []
  const identificationsImageData = identificationsImageQuery.data || []

  // console.log("USER IDENTIFICATION", userIdentificationsQuery.data)

  return (
    <div className="identifications-page">
      <Header.Root type="page" center>
        <Header.Title>
          {getCurrentTime().hour} : {getCurrentTime().minute} :{" "}
          {getCurrentTime().second}
        </Header.Title>
      </Header.Root>

      <div className="grid gc-4 gg-2 content-container">
        {identificationsImageData.length > 0 && userIdentificationsData.length > 0 && <>
          {userIdentificationsData.map((identification, index) => {
            let image = identificationsImageData.filter(i => i.id === identification.image_id)[0];
            console.log(image, identification)
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
      </div>
    </div>
  );
}

export default Identifications;

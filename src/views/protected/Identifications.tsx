import React, {useEffect} from 'react';
import Header from "../../components/Molecules/Header/Header";
import {useQuery} from "@tanstack/react-query";
import useUser from "../../hooks/auth/useUser";
import identifications from "../../services/api/plantaludum/identifications";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch";
import {flore} from "../../services/api/flore";
import {getAnotherFormat, getCurrentTime} from "../../utils/helpers";
import SingleImage
  from "../../components/Molecules/SingleImage/SingleImage/SingleImage";

function Identifications() {
  const user = useUser()
  const privateFetch = usePrivateFetch()

  const userIdentificationsQuery = useQuery({
    queryKey: ['user-identifications', user?.id],
    queryFn: () => identifications.list(privateFetch, user?.id as number),
    enabled: false
  })

  const identificationsImageQuery = useQuery({
    queryKey: ['identifications-image', user?.id],
    queryFn: () => flore.images.getWithIds(userIdentificationsQuery.data?.map(identification => {
      return identification.image_id
    }) as number[]),
    enabled: false
  })

  useEffect(() => {
    if (user) {
      userIdentificationsQuery.refetch()
    }
  }, [user]);

  useEffect(() => {
    if (userIdentificationsQuery.isSuccess) {
      identificationsImageQuery.refetch()
    }
  }, [userIdentificationsQuery.isSuccess]);

  return (
    <div>
      <Header.Root type="page" center>
        <Header.Title>{getCurrentTime().hour} : {getCurrentTime().minute} : {getCurrentTime().second}</Header.Title>
      </Header.Root>

      <div className="card-grid">
          {userIdentificationsQuery.isSuccess && identificationsImageQuery.isSuccess && <>
            {identificationsImageQuery.data.map(image => (
              <SingleImage.Root key={image.id} image={{...image, url: getAnotherFormat(image.url, "CRS")}} isClickable>
                <SingleImage.Up>
                </SingleImage.Up>
                <SingleImage.Down>
                </SingleImage.Down>
              </SingleImage.Root>
            ))}
          </>}
      </div>
    </div>
  );
}

export default Identifications;
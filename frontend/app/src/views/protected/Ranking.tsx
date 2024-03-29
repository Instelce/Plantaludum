import React from "react";
import Header from "../../components/Molecules/Header/Header";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import { users } from "../../services/api/plantaludum/users";
import { PaginationResponseType } from "../../services/api/types/pagination";
import { UserType } from "../../services/api/types/users";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch";
import BoxList from "../../components/Molecules/BoxList/BoxList";
import useUser from "../../hooks/auth/useUser";
import InfiniteLoader from "../../components/Molecules/InfiniteLoader/InfiniteLoader/InfiniteLoader";
import { Link } from "react-router-dom";
import { numberWithSpaces } from "../../utils/helpers";

function Ranking() {
  const privateFetch = usePrivateFetch();
  const currentUser = useUser();

  const usersQuery = useInfiniteQuery<PaginationResponseType<UserType>>({
    queryKey: ["users"],
    queryFn: ({ pageParam }) => users.list(privateFetch, pageParam as string),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.results.length === 10 &&
        lastPage.count > lastPage.results.length &&
        lastPage.next !== null
        ? allPages.length + 1
        : undefined;
    },
  });

  const userRank = useQuery({
    queryKey: ["current-user", currentUser?.id],
    queryFn: () => users.rank(privateFetch),
    enabled: currentUser != null
  })

  return (
    <div>
      <Header.Root type="page" center>
        <Header.Title>Classement</Header.Title>
      </Header.Root>

      {usersQuery.isSuccess && (
        <div className="content-container">
          {/* User rank */}
          {currentUser && userRank.isSuccess && userRank.data.ranking > 1 && <>
            <BoxList.Group size="large" hasBorder className="mb-2">
              <BoxList.Item className="sb center">
                <UserItem index={userRank.data.ranking} user={currentUser} />
              </BoxList.Item>
            </BoxList.Group>
          </>}

          {/* Users ranking */}
          <BoxList.Group size="large" hasBorder>
            {usersQuery.data.pages.map((page, pageIndex) =>
              page.results.map((user, userIndex) => {
                let index = userIndex + (10 * pageIndex)
                if (pageIndex === 0 && userIndex === 0) {
                  return (
                    <BoxList.Item
                      key={user.id}
                      className="sb center"
                      active
                      color="yellow"
                    >
                      <UserItem index={index} user={user} />
                    </BoxList.Item>
                  );
                }
                if (user.id === currentUser?.id) {
                  return (
                    <BoxList.Item key={user.id} className="sb center" active>
                      <UserItem index={index} user={user} />
                    </BoxList.Item>
                  );
                }
                return (
                  <BoxList.Item key={user.id} className="sb center">
                    <UserItem index={index} user={user} />
                  </BoxList.Item>
                );
              }),
            )}
          </BoxList.Group>
        </div>
      )}

      <InfiniteLoader
        message={"Chargement des données"}
        hasNextPage={usersQuery.hasNextPage}
        fetchNextPage={usersQuery.fetchNextPage}
      />
    </div>
  );
}

function UserItem({ index, user }: { index: number; user: UserType }) {
  return (
    <>
      <div className="center">
        <span className="h5 mr-2">{index + 1}</span>
        <Link to={`/profile/${user.id}`}>{user.username}</Link>
      </div>
      <span className="h5">{numberWithSpaces(user.score)}</span>
    </>
  );
}

export default Ranking;

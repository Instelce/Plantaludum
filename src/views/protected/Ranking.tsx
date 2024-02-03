import React from 'react';
import Header from "../../components/Molecules/Header/Header";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {users} from "../../services/api/plantaludum";
import {PaginationResponseType} from "../../services/api/types/pagination";
import {UserType} from "../../services/api/types/users";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch";
import BoxList from "../../components/Molecules/BoxList/BoxList";
import useUser from "../../hooks/auth/useUser";

function Ranking() {
  const privateFetch = usePrivateFetch()
  const currentUser = useUser()

  const usersQuery = useInfiniteQuery<PaginationResponseType<UserType>>({
    queryKey: ["users"],
    queryFn: () => users.list(privateFetch),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.results.length === 20 &&
      lastPage.count > lastPage.results.length
        ? allPages.length + 1
        : undefined;
    },
  })

  return (
    <div>
      <Header.Root type="page" center>
        <Header.Title>Classement</Header.Title>
      </Header.Root>

      {usersQuery.isSuccess && <div className="content-container">
        <BoxList.Group size="large" hasBorder>
          {usersQuery.data.pages.map((page, pageIndex) => page.results.map((user, userIndex) => {
            if (pageIndex === 0 && userIndex === 0) {
              return <BoxList.Item key={user.id} className="sb center" active color="yellow">
                <UserItem index={userIndex} user={user} />
              </BoxList.Item>
            }
            if (user.id === currentUser?.id) {
              return <BoxList.Item key={user.id} className="sb center" active>
                <UserItem index={userIndex} user={user} />
              </BoxList.Item>
            }
            return (
              <BoxList.Item key={user.id} className="sb center">
                <UserItem index={userIndex} user={user} />
              </BoxList.Item>
            )
          }))}
        </BoxList.Group>
      </div>}
    </div>
  );
}

function UserItem({index, user}: { index: number, user: UserType }) {
  return (
    <>
      <div className="center">
        <span className="h5 mr-2">{index + 1}</span>
        {user.username}
      </div>
      <span className="h5">{user.score}</span>
    </>
  )
}

export default Ranking;
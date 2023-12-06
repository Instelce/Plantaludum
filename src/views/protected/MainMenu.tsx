import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch.js";
import Navbar from "../../components/Organisms/Navbar/Navbar";
import Button from "../../components/Atoms/Buttons/Button";
import {DeckType, UserPlayedDeckType} from "../../services/api/types/decks";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {decks, users} from "../../services/api/plantaludum";
import useUser from "../../hooks/auth/useUser";
import DeckCard from "../../components/Molecules/DeckCard/DeckCard";
import Header from "../../components/Molecules/Header/Header";
import Input from "../../components/Atoms/Input/Input";
import {PaginationResponseType} from "../../services/api";
import ManageDeckButton
  from "../../components/Molecules/ManageDeckButton/ManageDeckButton";
import {useInView} from "react-intersection-observer";

function MainMenu() {
  const privateFetch = usePrivateFetch();
  const user = useUser();
  const { ref: loaderRef, inView: loaderInView } = useInView();

  const playedDecksQuery = useQuery<UserPlayedDeckType[]>({
    queryKey: ["user-played-decks"],
    queryFn: () => users.playedDecks.list(user?.id as number),
    enabled: false,
  });

  const userDecksQuery = useInfiniteQuery<PaginationResponseType<DeckType>>({
    queryKey: ["user-decks"],
    queryFn: ({pageParam}) => decks.list({
      fieldFilters: { user__id: user?.id },
      pageParam: pageParam as number
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.results?.length === 6 ? allPages.length + 1 : undefined;
    },
    enabled: false,
  });

  useEffect(() => {
    if (user) {
      playedDecksQuery.refetch();
      userDecksQuery.refetch();
    }
  }, [user]);

  useEffect(() => {
    if (userDecksQuery.hasNextPage) {
      userDecksQuery.fetchNextPage()
    }
  }, [userDecksQuery.hasNextPage]);

  return (
    <div className="mainmenu">
      <Navbar>
        <div className="left">
          <Link to="/explorer">Explorer</Link>
        </div>
        <div className="right">
          <Button asChild label="Nouveau deck" size="large" color="gray">
            <Link
              to="/decks/create"
              state={{ from: { pathname: location.pathname } }}
            >
              Nouveau deck
            </Link>
          </Button>
        </div>
      </Navbar>

      <Header.Root type="page">
        <Header.Title>
          Mon <span className="highlight">jardin</span>
        </Header.Title>
        <Header.Right>
          <p>{user?.username}</p>
        </Header.Right>
      </Header.Root>

      <Header.Root type="section">
        <Header.Title>Deck créé</Header.Title>
        <Header.Right>
          <Input type="search" label="Rechercher" />
        </Header.Right>
      </Header.Root>

      <div className="owndeck-grid">
        {userDecksQuery.isSuccess && (
          <>
            {userDecksQuery.data.pages.map(page => page.results).flat(1).map((deck) => (
              <ManageDeckButton key={deck.id} deck={deck} />
            ))}
          </>
        )}
        <div ref={loaderRef} style={{height: "1px"}}></div>
      </div>

      <Header.Root type="section">
        <Header.Title>Deck joué</Header.Title>
      </Header.Root>

      <main className="card-grid">
        {playedDecksQuery.isSuccess && (
          <>
            {playedDecksQuery.data.map((playedDeck) => (
              <DeckCard.Root key={playedDeck.id} deck={playedDeck.deck}>
                <Button asChild>
                  <Link
                    to={`/decks/${playedDeck.deck.id}/game/${playedDeck.level}`}
                  >
                    Continuer le niveau {playedDeck.level}
                  </Link>
                </Button>
              </DeckCard.Root>
            ))}
          </>
        )}
      </main>
    </div>
  );
}

export default MainMenu;

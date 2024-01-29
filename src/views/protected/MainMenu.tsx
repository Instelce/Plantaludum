import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch.js";
import Navbar from "../../components/Organisms/Navbar/Navbar";
import Button from "../../components/Atoms/Buttons/Button";
import { DeckType, UserPlayedDeckType } from "../../services/api/types/decks";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { decks, users } from "../../services/api/plantaludum";
import useUser from "../../hooks/auth/useUser";
import DeckCard from "../../components/Molecules/DeckCard/DeckCard";
import Header from "../../components/Molecules/Header/Header";
import Input from "../../components/Atoms/Input/Input";
import useObjectSearch from "../../hooks/useObjectSearch";
import ManageDeckButton from "../../components/Molecules/ManageDeckButton/ManageDeckButton";
import useUserDecks from "../../hooks/api/useUserDecks";

function MainMenu() {
  const privateFetch = usePrivateFetch();
  const user = useUser();
  const [searchOwnDeckInput, setSearchOwnDeckInput] = useState("");
  const userDecksQuery = useUserDecks(user?.id as number);

  const playedDecksQuery = useQuery<UserPlayedDeckType[]>({
    queryKey: ["user-played-decks"],
    queryFn: () => users.playedDecks.list(user?.id as number),
    enabled: false,
  });

  const ownDeckFilteredData = useObjectSearch<DeckType>({
    data: userDecksQuery.data,
    searchInput: searchOwnDeckInput,
    fieldName: "name",
  });

  useEffect(() => {
    if (user && playedDecksQuery.isStale) {
      playedDecksQuery.refetch();
    }
  }, [playedDecksQuery.isStale, user]);

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
          <Link to={`/profile/${user?.id}`} className="user-avatar">
            {user?.username[0].toUpperCase()}
          </Link>
        </Header.Right>
      </Header.Root>

      <Header.Root type="section">
        <Header.Title>Deck créé</Header.Title>
        <Header.Right>
          <Input
            type="search"
            label="Rechercher"
            value={searchOwnDeckInput}
            handleValueChange={setSearchOwnDeckInput}
          />
        </Header.Right>
      </Header.Root>

      <div className="owndeck-grid">
        {userDecksQuery.isSuccess && (
          <>
            {ownDeckFilteredData?.map((deck) => (
              <ManageDeckButton key={deck.id} deck={deck} />
            ))}

            {userDecksQuery.data.length === 0 && (
              <p>
                Créer ton{" "}
                <Link to="/decks/create" className="link">
                  premier deck
                </Link>
                .
              </p>
            )}
          </>
        )}
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
            {playedDecksQuery.data.length === 0 && (
              <p>
                Tu n'as pas encore joué à un deck. Découvre la diversité florale{" "}
                <Link to="/explorer" className="link">
                  ici
                </Link>
                .
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default MainMenu;

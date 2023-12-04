import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch.js";
import Navbar from "../../components/Organisms/Navbar/Navbar";
import Button from "../../components/Atoms/Buttons/Button";
import { UserPlayedDeckType } from "../../services/api/types/decks";
import { useQuery } from "@tanstack/react-query";
import { users } from "../../services/api/plantaludum";
import useUser from "../../hooks/auth/useUser";
import DeckCard from "../../components/Molecules/DeckCard/DeckCard";

function MainMenu() {
  const privateFetch = usePrivateFetch();
  const user = useUser();

  const playedDecksQuery = useQuery<UserPlayedDeckType[]>({
    queryKey: ["user-played-decks"],
    queryFn: () => users.playedDecks.list(user?.id as number),
    enabled: false,
  });

  useEffect(() => {
    if (user) {
      playedDecksQuery.refetch();
    }
  }, [user]);

  return (
    <>
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

      <header className="page-header">
        <h1>
          Mon <span className="highlight">jardin</span>
        </h1>
        <p>{user?.username}</p>
      </header>

      <main className="card-grid">
        {playedDecksQuery.isSuccess && (
          <>
            {playedDecksQuery.data.map((playedDeck) => (
              <DeckCard key={playedDeck.id} deck={playedDeck.deck} />
            ))}
          </>
        )}
      </main>
    </>
  );
}

export default MainMenu;

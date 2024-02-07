import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Atoms/Buttons/Button";
import { DeckType, UserPlayedDeckType } from "../../services/api/types/decks";
import { useQuery } from "@tanstack/react-query";
import { users } from "../../services/api/plantaludum/users";
import useUser from "../../hooks/auth/useUser";
import DeckCard from "../../components/Molecules/DeckCard/DeckCard";
import Header from "../../components/Molecules/Header/Header";
import Input from "../../components/Atoms/Input/Input";
import useObjectSearch from "../../hooks/useObjectSearch";
import ManageDeckButton from "../../components/Molecules/ManageDeckButton/ManageDeckButton";
import useUserDecks from "../../hooks/api/useUserDecks";

function MainMenu() {
  const user = useUser();

  return (
    <div className="mainmenu">
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

      <SectionOrder />
    </div>
  );
}

const SectionOrder = () => {
  if (localStorage.getItem("settings.switchingGardenSection") === "true") {
    return (
      <>
        <PlayedDeckSection />
        <CreatedDeckSection />
      </>
    );
  } else {
    return (
      <>
        <CreatedDeckSection />
        <PlayedDeckSection />
      </>
    );
  }
};

function CreatedDeckSection() {
  const user = useUser();
  const [searchInput, setSearchInput] = useState("");

  // User decks
  const userDecksQuery = useUserDecks({
    id: user?.id as number,
  });

  const ownDeckFilteredData = useObjectSearch<DeckType>({
    data: userDecksQuery.data,
    searchInput: searchInput,
    fieldName: "name",
  });

  return (
    <>
      <Header.Root type="section">
        <Header.Title>Deck créé</Header.Title>
        <Header.Right>
          <Input
            type="search"
            label="Rechercher"
            value={searchInput}
            handleValueChange={setSearchInput}
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
    </>
  );
}

function PlayedDeckSection() {
  const user = useUser();
  const [searchInput, setSearchInput] = useState("");

  // User played decks
  const playedDecksQuery = useQuery<UserPlayedDeckType[]>({
    queryKey: ["user-played-decks"],
    queryFn: () => users.playedDecks.list(user?.id as number),
    enabled: user != null,
  });

  const playedDeckFilteredData = useObjectSearch<UserPlayedDeckType>({
    data: playedDecksQuery?.data,
    searchInput: searchInput,
    fieldName: "deck",
    subField: "name",
  });

  return (
    <>
      <Header.Root type="section">
        <Header.Title>Deck joué</Header.Title>
        <Header.Right>
          <Input
            type="search"
            label="Rechercher"
            value={searchInput}
            handleValueChange={setSearchInput}
          />
        </Header.Right>
      </Header.Root>

      <main className="card-grid">
        {playedDecksQuery.isSuccess && (
          <>
            {playedDeckFilteredData?.map((playedDeck) => (
              <DeckCard.Root key={playedDeck.id}>
                <DeckCard.Header deck={playedDeck.deck} height={200}>
                  <span
                    className="level-progression"
                    style={{
                      width: `${33.333 * playedDeck.level}%`,
                      borderBottomRightRadius:
                        playedDeck.level === 3 ? 0 : "var(--radius)",
                      borderTopRightRadius:
                        playedDeck.level === 3 ? "var(--radius)" : 0,
                    }}
                  ></span>
                </DeckCard.Header>
                <DeckCard.Buttons>
                  <Button asChild>
                    <Link
                      to={`/decks/${playedDeck.deck.id}/game/${playedDeck.level}`}
                    >
                      Niveau {playedDeck.level}
                    </Link>
                  </Button>
                </DeckCard.Buttons>
              </DeckCard.Root>
            ))}
            {playedDecksQuery.data.length === 0 && (
              <p>
                Tu n&apos;as pas encore joué à un deck. Découvre la diversité
                florale{" "}
                <Link to="/explorer" className="link">
                  ici
                </Link>
                .
              </p>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default MainMenu;

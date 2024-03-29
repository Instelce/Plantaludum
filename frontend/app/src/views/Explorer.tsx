import {useMemo, useRef, useState } from "react";
import Input from "../components/Atoms/Input/Input";
import DeckCard from "../components/Molecules/DeckCard/DeckCard";
import Button from "../components/Atoms/Buttons/Button.jsx";
import Dropdown from "../components/Molecules/Dropdown/Dropdown";
import classNames from "classnames";
import Option from "../components/Atoms/Option/Option";
import { useInfiniteQuery } from "@tanstack/react-query";
import { decks } from "../services/api";
import Loader from "../components/Atoms/Loader/index.jsx";
import { Link } from "react-router-dom";
import { Edit, Search, Sliders, Zap } from "react-feather";
import { DeckType } from "../services/api/types/decks";
import useObjectSearch from "../hooks/useObjectSearch";
import useUser from "../hooks/auth/useUser";
import Header from "../components/Molecules/Header/Header";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PaginationResponseType } from "../services/api/types/pagination";
import InfiniteLoader from "../components/Molecules/InfiniteLoader/InfiniteLoader/InfiniteLoader";

function Explorer() {
  const user = useUser();
  const [searchInput, setSearchInput] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  // search and filters
  const panelRef = useRef<HTMLDivElement>(null);
  const [difficultyFilter, setDifficultyFilter] = useState(-1);

  // load decks data
  const {
    isLoading,
    isSuccess,
    data: decksData,
    fetchNextPage,
    // isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery<PaginationResponseType<DeckType>, Error>({
    queryKey: ["decks"],
    queryFn: ({ pageParam }) =>
      decks.list({
        fieldFilters: {
          private: false,
        },
        pageParam: pageParam as number,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.results.length === 6 &&
        lastPage.count > lastPage.results.length &&
        lastPage.next !== null
        ? allPages.length + 1
        : undefined;
    },
  });

  console.log(hasNextPage, decksData);

  // filter by search input value
  const searchFilteredDecks = useObjectSearch<DeckType>({
    data: decksData?.pages.map((page) => page.results).flat(1),
    fieldName: "name",
    searchInput: searchInput,
  });

  // filter data by difficulty
  const filteredDecks = useMemo(() => {
    return searchFilteredDecks?.filter((deck) => {
      if (!isNaN(difficultyFilter)) {
        return deck.difficulty === difficultyFilter;
      }
      return deck;
    });
  }, [searchFilteredDecks, difficultyFilter]);

  // useEffect(() => {
  //   console.log("search", searchFilteredDecks);
  // }, [searchFilteredDecks, filteredDecks]);

  // Header when scrolling
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".header", {
      scrollTrigger: {
        scroller: ".container",
        trigger: ".header",
        start: "top top",
        toggleActions: "play pause pause reset",
        scrub: true,
      },
      duration: 0.5,
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem",
    });
    gsap.to(".header .title", {
      scrollTrigger: {
        scroller: ".container",
        trigger: ".header",
        start: "top top",
        toggleActions: "play pause pause reset",
        scrub: true,
      },
      duration: 0.5,
      fontSize: "2rem",
    });
  });

  return (
    <>
      <div className="page-sticky">
        <Header.Root type="page">
          <Header.Title>
            <span className="highlight">Explore</span> les decks
          </Header.Title>
          <Header.Right>
            <Input
              label="Rechercher"
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              icon={<Search />}
            />
            <Button
              onlyIcon
              color="gray"
              title="Filtrer les decks"
              onClick={() => setShowFilter((prev) => !prev)}
            >
              <Sliders />
            </Button>
          </Header.Right>
        </Header.Root>

        <div
          className="filter-panel-container"
          style={{
            maxHeight: showFilter
              ? panelRef.current?.getBoundingClientRect().height
              : 0 + "px",
          }}
        >
          <div
            ref={panelRef}
            className={classNames("filter-panel", { show: showFilter })}
          >
            <Dropdown
              label="Difficulté"
              defaultValue="Toutes"
              handleValueChange={(value) =>
                setDifficultyFilter(parseInt(value))
              }
            >
              <Option>Toutes</Option>
              <Option>1</Option>
              <Option>2</Option>
              <Option>3</Option>
            </Dropdown>
          </div>
        </div>
      </div>

      {isSuccess && (
        <>
          <div className="card-grid">
            {filteredDecks && (
              <>
                {filteredDecks?.map((deck: DeckType) => (
                  <DeckCard.Root key={deck.id} followMouse={false}>
                    <DeckCard.Header deck={deck} />
                    <DeckCard.Buttons>
                      <Button asChild title="Découvrir" label="Découvrir">
                        <Link to={`/decks/${deck.id}`}>
                          {user?.id === deck.user.id ? "Détail" : "Découvrir"}
                        </Link>
                      </Button>
                      {user?.id === deck.user.id && (
                        <Button asChild onlyIcon title="Mise à jour" color="yellow">
                          <Link to={`/decks/${deck.id}/update`}>
                            <Edit />
                          </Link>
                        </Button>
                      )}
                      <Button asChild title="Jouer au deck" color="yellow" onlyIcon>
                        <Link to={`/decks/${deck.id}/game/1`}>
                          <Zap />
                        </Link>
                      </Button>
                    </DeckCard.Buttons>
                  </DeckCard.Root>
                ))}
              </>
            )}
          </div>

          <InfiniteLoader
            message={"Chargement des decks"}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
          />

          {!hasNextPage && searchInput.length === 0 ? (
            <div className="flex center pt-2 pb-2">
              <p className="t-center">
                Plus aucun deck à charger ! <br />
                Si tu penses qu&apos;il manque un deck,{" "}
                <Link to="/decks/create" className="link">
                  crées-en un
                </Link>
                .
              </p>
            </div>
          ) : <>
            {filteredDecks?.length === 0 && (
                <div className="flex center pt-2 pb-2">
                  <p className="t-center">
                    Aucun decks ayant le nom : {searchInput}
                  </p>
                </div>
              )
            }
          </>}
        </>
      )}

      {isLoading && (
        <div className="center-loader">
          <Loader/>
        </div>
      )}
    </>
  );
}

export default Explorer;

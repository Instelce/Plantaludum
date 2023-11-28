import React from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../../components/Loader/index.jsx";
import { EyeOff, RefreshCw, Share, Trash } from "react-feather";
import Button from "../../components/ui/Buttons/Button.jsx";
import useDeck from "../../hooks/api/useDeck.js";
import Navbar from "../../components/Navbar/Navbar";
import Tabs from "../../components/ui/Tabs/index.jsx";
import PlantCard from "../../components/PlantCard/PlantCard";
import { useAuth } from "../../context/AuthProvider";
import Stars from "../../components/ui/Stars/Stars";

function DeckDetail() {
  const { deckId } = useParams();
  const { user } = useAuth();

  const { deckQuery, deckPlantsQuery, deckPlantsImagesQuery } = useDeck({
    deckId,
    fetchPlants: true,
    fetchImages: true,
  });

  return (
    <div className="deck-detail">
      <Navbar>
        <div className="left">
          <Link to="/mon-jardin">Mon jardin</Link>
          <Link to="/explorer">Explorer</Link>
        </div>
        <div className="right">
          {user && (
            <Button asChild label="Nouveau deck" size="large" color="gray">
              <Link
                to="/decks/create"
                state={{ from: { pathname: location.pathname } }}
              >
                Nouveau deck
              </Link>
            </Button>
          )}
        </div>
      </Navbar>

      {deckQuery.isSuccess && (
        <>
          <header className="page-header center">
            <div className="header-img">
              <img src={deckQuery.data.preview_image_url} alt="Preview image" />
            </div>

            <h1>
              {deckQuery.data.name}
              {deckQuery.data.private && <EyeOff />}
            </h1>
            <p>
              par{" "}
              <Link to={`/users/${deckQuery.data.user}`} className="link">
                {deckQuery.data.user}
              </Link>
            </p>

            <Stars count={parseInt(deckQuery.data.difficulty)} />

            <div>
              <Button asChild>
                <Link to={`/decks/${deckId}/game`}>Jouer</Link>
              </Button>
              <Button color="gray" onlyIcon>
                <Share />
              </Button>
              {deckId === user.id && (
                <>
                  <Button asChild color="yellow" onlyIcon>
                    <Link to={`/decks/${deckId}/update`}>
                      <RefreshCw />
                    </Link>
                  </Button>
                  <Button color="danger" onlyIcon>
                    <Trash />
                  </Button>
                </>
              )}
            </div>
          </header>

          <Tabs.Root defaultValue="actions">
            <div className="fill-horizontal center sep-bottom">
              <Tabs.List>
                <Tabs.Trigger value="actions">Actions</Tabs.Trigger>
                <Tabs.Trigger value="plantes">Plantes</Tabs.Trigger>
                <Tabs.Trigger value="plus-infos">Plus d'info</Tabs.Trigger>
              </Tabs.List>
            </div>

            <Tabs.Content value="actions">
              <p>actions</p>
            </Tabs.Content>

            <Tabs.Content value="plantes">
              <p>plantes</p>
              <div className="list-container">
                <div className="list-wrapper">
                  {deckPlantsQuery.isSuccess && (
                    <>
                      {deckPlantsQuery.data.map((plant, index) => (
                        <PlantCard
                          key={plant.id}
                          index={index}
                          plant={plant}
                          images={deckPlantsImagesQuery.data
                            ?.filter((p) => p.id === plant.id)?.[0]
                            ?.images?.map((img) => img.url)
                            .slice(0, 5)}
                        />
                      ))}
                    </>
                  )}
                </div>
              </div>

              {deckPlantsQuery.isLoading && <Loader />}
            </Tabs.Content>

            <Tabs.Content value="plus-infos">
              <p>{deckQuery.data.description}</p>
            </Tabs.Content>
          </Tabs.Root>
        </>
      )}

      {deckQuery.isLoading && <Loader />}
    </div>
  );
}

export default DeckDetail;

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
import useUser from "../../hooks/auth/useUser";

function DeckDetail() {
  const { deckId } = useParams();
  const user = useUser();

  const { deckQuery, deckPlantsQuery, deckPlantsImagesQuery } = useDeck({
    deckId: deckId ? deckId : "",
    fetchPlants: true,
    fetchImages: true,
  });
  const isOwner = user?.id === deckQuery.data?.user;

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
            </div>
          </header>

          <Tabs.Root defaultValue="plantes">
            <div className="fill-horizontal center sep-bottom">
              <Tabs.List>
                {isOwner && (
                  <Tabs.Trigger value="actions">Actions</Tabs.Trigger>
                )}
                <Tabs.Trigger value="plantes">Plantes</Tabs.Trigger>
                <Tabs.Trigger value="plus-infos">Plus d'info</Tabs.Trigger>
              </Tabs.List>
            </div>

            {isOwner && (
              <Tabs.Content value="actions">
                <div className="container-table-page">
                  <div className="grid gc-2 gg-1">
                    <Button asChild className="sb">
                      <Link to={`/decks/${deckId}/update`}>
                        Mettre à jour
                        <RefreshCw />
                      </Link>
                    </Button>
                    <Button className="sb" color="danger" fill>
                      Supprimer
                      <Trash />
                    </Button>
                  </div>
                </div>
              </Tabs.Content>
            )}

            <Tabs.Content value="plantes">
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
              <div className="container-table-page">
                <p>{deckQuery.data.description}</p>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </>
      )}

      {deckQuery.isLoading && <Loader />}
    </div>
  );
}

export default DeckDetail;

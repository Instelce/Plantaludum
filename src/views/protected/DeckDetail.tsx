import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  loadPlantsIdsList,
  loadPlants,
  loadDeck,
  loadDeckPlants,
  loadPlantsIdsListImages,
} from "../../services/api/api.js";
import Loader from "../../components/Loader/index.jsx";
import ButtonLink from "../../components/ui/Buttons/ButtonLink.jsx";
import {
  ArrowRight,
  EyeOff,
  RefreshCcw,
  RefreshCw,
  Share,
  Trash,
  Trash2,
} from "react-feather";
import Button from "../../components/ui/Buttons/Button.jsx";
import Stars from "../../components/ui/Stars/index.jsx";
import React, { useEffect } from "react";
import ListItem from "../../components/ListItem/index.jsx";
import useDeck from "../../hooks/api/useDeck.js";
import { getObjectKeyValues } from "../../utils/helpers";
import Navbar from "../../components/Navbar/index.jsx";
import useAuth from "../../hooks/auth/useAuth.js";
import Tabs from "../../components/ui/Tabs/index.jsx";
import PlantCard from "../../components/PlantCard/index.jsx";

function DeckDetail(props) {
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
            <ButtonLink
              to="/decks/create"
              state={{ from: { pathname: location.pathname } }}
              label="Nouveau deck"
              size="large"
              color="gray"
            />
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
            <Stars count={deckQuery.data.difficulty} />

            <div>
              <ButtonLink to={`/decks/${deckId}/game`} label="Jouer" />
              <Button icon={<Share />} color="gray" />
              {deckId === user.id && (
                <>
                  <ButtonLink
                    to={`/decks/${deckId}/update`}
                    icon={<RefreshCw />}
                    color="yellow"
                  />
                  <Button icon={<Trash />} color="danger" />
                </>
              )}
            </div>

            <div></div>
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

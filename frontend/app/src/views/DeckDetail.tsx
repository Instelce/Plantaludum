import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Atoms/Loader";
import { Edit, Lock, RefreshCw, Share, Trash } from "react-feather";
import Button from "../components/Atoms/Buttons/Button";
import useDeck from "../hooks/api/useDeck";
import Navbar from "../components/Organisms/Navbar/Navbar";
import Tabs from "../components/Molecules/Tabs";
import PlantCard from "../components/Molecules/PlantCard/PlantCard";
import Stars from "../components/Atoms/Stars/Stars";
import useUser from "../hooks/auth/useUser";
import Flower from "../components/Atoms/Icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { decks } from "../services/api";
import usePrivateFetch from "../hooks/auth/usePrivateFetch";
import Modal from "../components/Molecules/Modal/Modal";
import { useNotification } from "../context/NotificationsProvider";
import useCacheImages from "../hooks/useCacheImages";
import DeckLevelCard from "../components/Molecules/DeckLevelCard/DeckLevelCard";
import { UserPlayedDeckType } from "../services/api/types/decks";
import { users } from "../services/api/plantaludum/users";
import { AxiosError } from "axios";
import {AsyncImage} from "../components/Atoms/Image/Image";

function DeckDetail() {
  const queryClient = useQueryClient();
  const { deckId } = useParams();
  const user = useUser();
  const privateFetch = usePrivateFetch();
  const navigate = useNavigate();
  const notification = useNotification();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isFisrtPlay, setIsFisrtPlay] = useState(false);

  const { setImagesArray: setImagesArray } =
    useCacheImages();

  const { deckQuery, deckPlantsQuery, deckPlantsImagesQuery } = useDeck({
    deckId: parseInt(deckId as string),
    fetchPlants: true,
    fetchImages: true,
  });
  const isOwner = user?.id === deckQuery.data?.user.id;

  const userPlayedDeckQuery = useMutation<UserPlayedDeckType>({
    mutationKey: ["user-played-decks", deckId],
    mutationFn: () =>
      users.playedDecks.details(user?.id as number, parseInt(deckId as string)),
    onError: (err: Error) => {
      const e = err as AxiosError;
      if (e.response?.status === 500) {
        console.log("Le joueur n'a jamais joué ce deck");
        setIsFisrtPlay(true);
      }
    },
  });

  const { mutate: mutateDeleteDeck } = useMutation({
    mutationKey: ["decks", deckId],
    mutationFn: () => decks.delete(privateFetch, parseInt(deckId as string)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      queryClient.invalidateQueries({ queryKey: ["decks", deckId] });
      notification.success({ message: `${deckQuery.data?.name} supprimé` });
      navigate(`/mon-jardin`);
    },
  });

  // load images in cache
  useEffect(() => {
    if (deckPlantsImagesQuery.isSuccess) {
      setImagesArray(() =>
        Object.values(deckPlantsImagesQuery.data)
          .map((plants) => plants.images)
          .map((images) => images.map((img) => img.url))
          .flat(1),
      );
    }
  }, [deckPlantsImagesQuery.isSuccess]);

  useEffect(() => {
    if (user && !isFisrtPlay && !userPlayedDeckQuery.data) {
      userPlayedDeckQuery.mutate();
    }
  }, [user, isFisrtPlay]);

  return (
    <div className="deck-detail">
      {isOwner && (
        <Modal show={showDeleteModal}>
          <h3>Es-tu sûr ?</h3>
          <p>Une fois supprimé, impossible de le récupérer.</p>
          <div className="modal-buttons mt-2">
            <Button onClick={() => setShowDeleteModal(false)} color="gray">
              Non
            </Button>
            <Button onClick={() => mutateDeleteDeck()} color="danger">
              Oui
            </Button>
          </div>
        </Modal>
      )}

      {deckQuery.isSuccess && (
        <>
          <header className="page-header center">
            <div className="header-img">
              <div className="img-container">
                <AsyncImage
                  src={deckQuery.data.preview_image_url}
                  alt="Preview image"
                />
              </div>

              <div className="stars-container">
                <Stars count={deckQuery.data.difficulty} icon={<Flower />} />
              </div>
            </div>

            <h1>
              {deckQuery.data.name}
              {deckQuery.data.private && <Lock className="ml-1" />}
            </h1>
            <p>
              <Link to={`/profile/${deckQuery.data.user.id}`} className="link">
                {deckQuery.data.user.username}
              </Link>
            </p>

            <div className="header-buttons">
              <Button asChild>
                <Link
                  to={`/decks/${deckId}/game/${
                    userPlayedDeckQuery.isSuccess
                      ? userPlayedDeckQuery.data?.level
                      : 1
                  }`}
                >
                  Jouer
                </Link>
              </Button>
              <Button
                color="gray"
                onlyIcon
                onClick={() => {
                  navigator.clipboard.writeText(location.href);
                  notification.success({
                    message: "Url copié"
                  })
                }}
              >
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
                <Tabs.Trigger value="progression">Progression</Tabs.Trigger>
                <Tabs.Trigger value="plantes">Plantes</Tabs.Trigger>
                <Tabs.Trigger value="plus-infos">Plus d&apos;infos</Tabs.Trigger>
              </Tabs.List>
            </div>

            {isOwner && (
              <Tabs.Content value="actions">
                <div className="container-table-page">
                  <div className="grid gc-2 gg-1">
                    <Button asChild className="sb">
                      <Link to={`/decks/${deckId}/update`}>
                        Mettre à jour
                        <Edit />
                      </Link>
                    </Button>
                    <Button asChild className="sb">
                      <Link to={`/decks/${deckId}/plants`}>
                        Mettre à jour les plantes
                        <Flower color="rgb(var(--color-gray-3))" />
                      </Link>
                    </Button>
                  </div>
                  <Button
                    className="sb mt-1"
                    color="danger"
                    fill
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Supprimer
                    <Trash />
                  </Button>
                </div>
              </Tabs.Content>
            )}

            <Tabs.Content value="progression">
              <div className="container-table-page">
                {userPlayedDeckQuery.isSuccess ? (
                  <div className="grid gc-3 gg-1">
                    {[1, 2, 3].map((level) => (
                      <DeckLevelCard
                        key={level}
                        deck={deckQuery.data}
                        level={level}
                        levelStars={
                          level < userPlayedDeckQuery.data.level
                            ? 3
                            : userPlayedDeckQuery.data.current_stars
                        }
                        isReached={level <= userPlayedDeckQuery.data.level}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid gc-3 gg-1">
                    {[1, 2, 3].map((level) => (
                      <DeckLevelCard
                        key={level}
                        deck={deckQuery.data}
                        level={level}
                        levelStars={1}
                        isReached={level == 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Tabs.Content>

            <Tabs.Content value="plantes">
              <div className="list-container mt-2 mb-2">
                <div className="list-wrapper">
                  {deckPlantsQuery.isSuccess && (
                    <>
                      {deckPlantsQuery.data.map((plant) => (
                        <PlantCard
                          key={plant.id}
                          plant={plant}
                          images={
                            deckPlantsImagesQuery.data
                              ?.filter((p) => p.id === plant.id)?.[0]
                              ?.images?.map((img) => img.url)
                              .slice(0, 5) as string[]
                          }
                        />
                      ))}
                    </>
                  )}
                </div>
              </div>

              {deckPlantsQuery.isLoading && (
                <div className="center-loader">
                  <Loader />
                </div>
              )}
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

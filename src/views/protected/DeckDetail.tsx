import React, {useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
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
import Flower from "../../components/ui/Icons";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {decks} from "../../services/api";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch";
import Modal from "../../components/ui/Modal";
import {useNotification} from "../../context/NotificationsProvider";

function DeckDetail() {
  const { deckId } = useParams();
  const user = useUser();
  const privateFetch = usePrivateFetch()
  const navigate = useNavigate();
  const notification = useNotification();
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const { deckQuery, deckPlantsQuery, deckPlantsImagesQuery } = useDeck({
    deckId: deckId ? deckId : "",
    fetchPlants: true,
    fetchImages: true,
  });
  const isOwner = user?.id === deckQuery.data?.user;

  const queryClient = useQueryClient()
  const {mutate: mutateDeleteDeck} = useMutation({
    mutationKey: ["decks", deckId],
    mutationFn: () => decks.delete(privateFetch, parseInt(deckId as string)),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["decks", deckId]});
      notification.success({message: `${deckQuery.data?.name} supprimé`});
      navigate(`/mon-jardin`)
    },
  })

  return (
    <div className="deck-detail">
      <Modal show={showDeleteModal}>
        <h3>Est tu sur ?</h3>
        <p>Une fois supprimer, impossible de le récupérer.</p>
        <div className="modal-buttons mt-2">
          <Button onClick={() => setShowDeleteModal(false)} color="gray">Non</Button>
          <Button onClick={() => mutateDeleteDeck()} color="danger">Oui</Button>
        </div>
      </Modal>

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

            <Stars count={parseInt(deckQuery.data.difficulty)} icon={<Flower />}/>

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
                    <Button className="sb" color="danger" fill onClick={() => setShowDeleteModal(true)}>
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

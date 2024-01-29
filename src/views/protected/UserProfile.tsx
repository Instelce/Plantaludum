import useUser from "../../hooks/auth/useUser";
import { Link, useParams } from "react-router-dom";
import Button from "../../components/Atoms/Buttons/Button";
import Navbar from "../../components/Organisms/Navbar/Navbar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { users } from "../../services/api/plantaludum";
import useUserDecks from "../../hooks/api/useUserDecks";
import DeckCard from "../../components/Molecules/DeckCard/DeckCard";
import { Check, RefreshCcw, Trash, Zap } from "react-feather";
import React, { FormEvent, FormEventHandler, useState } from "react";
import Header from "../../components/Molecules/Header/Header";
import Tabs from "../../components/Molecules/Tabs";
import Modal from "../../components/Molecules/Modal/Modal";
import Input from "../../components/Atoms/Input/Input";
import { auth } from "../../services/api";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch";
import { useNotification } from "../../context/NotificationsProvider";

function UserProfile() {
  const { userId } = useParams();
  const privateFetch = usePrivateFetch();
  const notifications = useNotification();
  const [showConfirmationModal, setShowConfirmationModal] = useState({
    show: false,
    modal: "",
  });

  // User decks
  const userDecksQuery = useUserDecks(parseInt(userId));

  // User data
  const currentUser = useUser();
  const userQuery = useQuery({
    queryKey: ["users", userId],
    queryFn: () => users.details(parseInt(userId)),
  });
  const userData = userQuery.data || null;

  // Update user data
  const queryClient = useQueryClient();
  const updateUserMutation = useMutation({
    mutationKey: ["user-update", userId],
    mutationFn: (data: object) =>
      users.update(privateFetch, parseInt(userId), data),
    onSuccess: (data) => {
      // invalidate all user queries
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
      queryClient.invalidateQueries({ queryKey: ["user-decks", userId] });
      if (userData?.id === currentUser?.id) {
        queryClient.invalidateQueries({ queryKey: ["current-user"] });
      }
      notifications.success({
        message: "Ton compte a été mis à jour",
      });
    },
  });

  // reset stats
  const refreshUserStatsMutation = useMutation({
    mutationKey: ["user-refresh-stats", userId],
    mutationFn: () =>
      users.update(privateFetch, parseInt(userId), {
        score: 0,
        level: 0,
        games_played: 0,
      }),
    onSuccess: (data) => {
      // invalidate all user queries
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
      queryClient.invalidateQueries({ queryKey: ["user-decks", userId] });
      if (userData?.id === currentUser?.id) {
        queryClient.invalidateQueries({ queryKey: ["current-user"] });
      }
      notifications.success({
        message: "Tes stats on été mis à zero",
      });
    },
  });

  // delete account
  const deleteUserAccountMutation = useMutation({
    mutationKey: ["user-refresh-stats", userId],
    mutationFn: () => users.delete(privateFetch, userId),
    onSuccess: (data) => {
      // invalidate all user queries
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
      queryClient.invalidateQueries({ queryKey: ["user-decks", userId] });
      if (userData?.id === currentUser?.id) {
        queryClient.invalidateQueries({ queryKey: ["current-user"] });
      }
      notifications.success({
        message: "Ton compte à été supprimer correctement",
      });
    },
  });

  function submitUpdateForm(e: FormEvent) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    updateUserMutation.mutate(formData);
  }

  return (
    <div className="profile">
      {showConfirmationModal.show && (
        <Modal show={showConfirmationModal.show}>
          {showConfirmationModal.modal === "reset-stats" ? (
            <>
              <h3>Est tu sur ?</h3>
              <p>Toutes tes stats vont être supprimé !</p>
              <div className="modal-buttons mt-2">
                <Button
                  onClick={() =>
                    setShowConfirmationModal({
                      modal: "",
                      show: false,
                    })
                  }
                  color="gray"
                >
                  Non
                </Button>
                <Button
                  onClick={() => {
                    refreshUserStatsMutation.mutate();
                    setShowConfirmationModal({ modal: "", show: false });
                  }}
                  color="danger"
                >
                  Oui
                </Button>
              </div>
            </>
          ) : (
            <>
              <h3>Est tu sur ?</h3>
              <p>
                Ton compte vas être supprimé, avec toutes les données allant
                avec.
              </p>
              <div className="modal-buttons mt-2">
                <Button
                  onClick={() =>
                    setShowConfirmationModal({
                      modal: "",
                      show: false,
                    })
                  }
                  color="gray"
                >
                  Non
                </Button>
                <Button
                  onClick={() => {
                    deleteUserAccountMutation.mutate();
                    setShowConfirmationModal({ modal: "", show: false });
                  }}
                  color="danger"
                >
                  Oui
                </Button>
              </div>
            </>
          )}
        </Modal>
      )}

      <Navbar>
        <div className="left">
          <Link to="/mon-jardin">Mon jardin</Link>
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
        {userData && currentUser && (
          <Header.Title>{userData.username}</Header.Title>
        )}

        <Header.Right>
          <span>Score</span>
          <h2>{userData?.score}</h2>
          {/*{userData?.level}*/}
        </Header.Right>
      </Header.Root>

      {userData && currentUser && (
        <>
          {currentUser.id === userData.id && (
            <>
              <Tabs.Root defaultValue="actions">
                <div className="fill-horizontal center sep-bottom">
                  <Tabs.List>
                    <Tabs.Trigger value="donnees">Infos Compte</Tabs.Trigger>
                    <Tabs.Trigger value="actions">Actions</Tabs.Trigger>
                  </Tabs.List>
                </div>

                <Tabs.Content value="actions">
                  <div className="container-table-page">
                    <form onSubmit={submitUpdateForm}>
                      <Input
                        label="Nom"
                        id="username"
                        defaultValue={userData.username}
                      />
                      <Input
                        label="Email"
                        id="email"
                        type="email"
                        defaultValue={userData.email}
                      />
                      <Button className="sb" size="large" type="submit" fill>
                        <span>Modifier mon compte</span>
                        <Check />
                      </Button>
                    </form>
                    <div className="double-buttons mt-2">
                      <Button
                        className="sb"
                        size="large"
                        color="danger"
                        fill
                        onClick={() =>
                          setShowConfirmationModal({
                            modal: "reset-stats",
                            show: true,
                          })
                        }
                      >
                        <span>Reset mes stats</span>
                        <RefreshCcw />
                      </Button>
                      <Button
                        className="sb"
                        size="large"
                        color="danger"
                        fill
                        onClick={() =>
                          setShowConfirmationModal({
                            modal: "delete-account",
                            show: true,
                          })
                        }
                      >
                        <span>Supprimer mon compte</span>
                        <Trash />
                      </Button>
                    </div>
                  </div>
                </Tabs.Content>

                <Tabs.Content value="donnees">
                  <div className="container-table-page">
                    <p>Email : {currentUser.email}</p>
                    <p>Score : {currentUser.score}</p>
                    <p>Level : {currentUser.level}</p>
                    <p>Parties joué : {currentUser.games_played}</p>
                  </div>
                </Tabs.Content>
              </Tabs.Root>
            </>
          )}
        </>
      )}

      {/* User decks section */}
      <Header.Root type="section">
        <h2>Decks</h2>
      </Header.Root>

      <div className="card-grid">
        {userDecksQuery.isSuccess && (
          <>
            {userDecksQuery.data?.map((deck) => (
              <>
                <DeckCard.Root key={deck.id} deck={deck}>
                  <Button asChild label="Découvrir">
                    <Link to={`/decks/${deck.id}`}>
                      {currentUser?.id === deck.user.id
                        ? "Détail"
                        : "Découvrir"}
                    </Link>
                  </Button>
                  <Button asChild onlyIcon color="yellow">
                    <Link to={`/decks/${deck.id}/game/1`}>
                      <Zap />
                    </Link>
                  </Button>
                </DeckCard.Root>
              </>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
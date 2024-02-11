import useUser from "../../hooks/auth/useUser";
import { Link, useParams } from "react-router-dom";
import Button from "../../components/Atoms/Buttons/Button";
import Navbar from "../../components/Organisms/Navbar/Navbar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { users } from "../../services/api/plantaludum/users";
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
import BoxList from "../../components/Molecules/BoxList/BoxList";
import {useAuth} from "../../context/AuthProvider";

function UserProfile() {
  const { userId } = useParams();
  const {setUser, setAccessToken} = useAuth()
  const privateFetch = usePrivateFetch();
  const notifications = useNotification();
  const [showConfirmationModal, setShowConfirmationModal] = useState({
    show: false,
    modal: "",
  });

  // User data
  const currentUser = useUser();
  const userQuery = useQuery({
    queryKey: ["users", userId],
    queryFn: () => users.details(parseInt(userId)),
  });
  const userData = userQuery.data || null;

  // Current user profile
  const currentUserProfile = userData?.id === currentUser?.id;

  // User decks
  const userDecksQuery = useUserDecks({
    id: parseInt(userId),
    fieldFilters: currentUserProfile ? {} : { private: false },
  });

  // Update user data mutation
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

  // Reset stats mutation
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
                    setUser({});
                    setAccessToken(null);
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

      <Header.Root type="page">
        {userData && currentUser && (
          <Header.Title>{userData.username}</Header.Title>
        )}

        <Header.Right>
          <span>Points</span>
          <h2>{userData?.score}</h2>
        </Header.Right>
      </Header.Root>

      {/* User information section */}
      {userData && currentUser && (
        <>
          {currentUserProfile && (
            <>
              <Tabs.Root defaultValue="donnees">
                <div className="fill-horizontal sep-bottom page-padding">
                  <Tabs.List>
                    <Tabs.Trigger value="donnees">Infos Compte</Tabs.Trigger>
                    <Tabs.Trigger value="actions">Actions</Tabs.Trigger>
                  </Tabs.List>
                </div>

                <Tabs.Content value="actions">
                  <div className="content-container">
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
                  <div className="content-container">
                    <BoxList.Group size="large" rounded background="dark-gray">
                      <BoxList.Item className="sb">
                        <span>Email</span>
                        <span>{currentUser.email}</span>
                      </BoxList.Item>
                      <BoxList.Item className="sb">
                        <span>Points</span>
                        <span>{currentUser.score}</span>
                      </BoxList.Item>
                      <BoxList.Item className="sb">
                        <span>Level</span>
                        <span>{currentUser.level}</span>
                      </BoxList.Item>
                      <BoxList.Item className="sb">
                        <span>Parties jouées</span>
                        <span>{currentUser.games_played}</span>
                      </BoxList.Item>
                      <BoxList.Item className="sb">
                        <span>Identifications</span>
                        <span>{currentUser.identifications}</span>
                      </BoxList.Item>
                    </BoxList.Group>
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
                <DeckCard.Root key={deck.id}>
                  <DeckCard.Header deck={deck} />
                  <DeckCard.Buttons>
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
                  </DeckCard.Buttons>
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

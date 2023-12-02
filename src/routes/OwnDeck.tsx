import React, {PropsWithChildren, useEffect} from "react";
import useUser from "../hooks/auth/useUser";
import {Navigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {decks} from "../services/api";
import {useNotification} from "../context/NotificationsProvider";

function OwnDeck({ children }: PropsWithChildren) {
  const { deckId } = useParams();
  const user = useUser();
  const notifications = useNotification();

  const { data: deckData, isSuccess } = useQuery({
    queryKey: ["decks", deckId],
    queryFn: () => {
      return decks.details(parseInt(deckId as string));
    },
  });

  // error notification
  useEffect(() => {
    if (isSuccess && user) {
      if (deckData.user.id != user.id) {
        notifications.danger({
          message: "Vous n'êtes propriétaire de ce deck",
        });
      }
    }
  }, [isSuccess, deckData, user]);

  if (isSuccess && user) {
    if (deckData.user.id === user.id) {
      return children;
    } else {
      return <Navigate to={`/decks/${deckId}`} />;
    }
  }
}

export default OwnDeck;

import React, {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useReducer,
} from "react";
import {StatusProp} from "../types/helpers";
import {AlertCircle, CheckCircle, Info, XCircle} from "react-feather";
import {
  notificationReducer
} from "../components/Molecules/Notification/notificationReducer";
import NotificationContainer
  from "../components/Molecules/Notification/NotificationContainer";

export const notificationIcons: {
  [key in StatusProp]: ReactNode;
} = {
  success: <CheckCircle />,
  danger: <XCircle />,
  warning: <AlertCircle />,
  info: <Info />,
};

export type NotificationType = {
  id?: string;
  message: string;
  type?: StatusProp;
  duration?: number;
};

type NotificationsContextType = {
  success: (notification: NotificationType) => void;
  danger: (notification: NotificationType) => void;
  warning: (notification: NotificationType) => void;
  info: (notification: NotificationType) => void;
  remove: (id: number) => void;
};

const NotificationContext = createContext<NotificationsContextType>({});

export function useNotification(): NotificationsContextType {
  return useContext(NotificationContext);
}

export function NotificationsProvider({ children }: PropsWithChildren) {
  const [state, displatch] = useReducer(notificationReducer, {
    notifications: [],
  });

  const addNotification = (notif: NotificationType) => {
    const id = Math.floor(Math.random() * 100000000000);
    displatch({
      type: "ADD_NOTIFICATION",
      payload: {
        ...notif,
        id: id,
        duration: notif.duration ? notif.duration : 3000,
      },
    });
  };

  const success = (notif: NotificationType) =>
    addNotification({ ...notif, type: "success" });
  const danger = (notif: NotificationType) =>
    addNotification({ ...notif, type: "danger" });
  const warning = (notif: NotificationType) =>
    addNotification({ ...notif, type: "warning" });
  const info = (notif: NotificationType) =>
    addNotification({ ...notif, type: "info" });

  const remove = (id: number) => {
    displatch({ type: "REMOVE_NOTIFICATION", payload: id });
  };

  return (
    <NotificationContext.Provider
      value={{
        success,
        danger,
        warning,
        info,
        remove,
      }}
    >
      <NotificationContainer notifications={state.notifications} />
      {children}
    </NotificationContext.Provider>
  );
}

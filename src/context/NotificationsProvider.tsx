import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { StatusProp } from "../types/helpers";
import set = gsap.set;

export type NotificationType = {
  id: string;
  message: string;
  status: StatusProp;
  duration: number;
  active?: boolean;
};

type NotificationsContextType = {
  notifications: NotificationType[];
  addNotification: (notification: NotificationType) => void;
  removeNotification: (index: number) => void;
};

const NotificationContext = createContext<NotificationsContextType>({
  notifications: [],
  addNotification: (notification: NotificationType) => {},
  removeNotification: (index: number) => {},
});

export function useNotification(): NotificationsContextType {
  return useContext(NotificationContext);
}

export function NotificationsProvider({ children }: PropsWithChildren) {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const addNotification = (notification: Omit<NotificationType, "active">) => {
    let newNotifications = notifications.filter((i) => i.active);
    console.log("f", newNotifications)

    setNotifications(() => newNotifications.concat({
      ...notification,
      active: true,
    }));
  };

  const removeNotification = (index: number) => {
    setNotifications(
      notifications.map((notification, i) => {
        if (i === index) {
          return {
            ...notification,
            active: false,
          };
        }
        return notification;
      }),
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

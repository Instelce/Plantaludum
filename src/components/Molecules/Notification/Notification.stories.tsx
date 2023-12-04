import "./Notification.scss";
import Notification from "./Notification";
import { NotificationType } from "../../../context/NotificationsProvider";
import { useState } from "react";
import Button from "../../Atoms/Buttons/Button";

export default {
  title: "Molecules/Notification",
  component: Notification,
  tags: ["autodocs"],
};

export const SimpleNotification = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  return (
    <>
      <Button
        className="mb-1"
        onClick={() =>
          setNotifications([
            ...notifications,
            { id: 2, message: "Notification", type: "success", duration: 3000 },
          ])
        }
      >
        New Notification
      </Button>
      {notifications.map((notification) => (
        <Notification
          id={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
        />
      ))}
    </>
  );
};

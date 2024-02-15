// @ts-nocheck
import { NotificationType } from "../../../context/NotificationsProvider";
import Notification from "./Notification";

function NotificationContainer({
  notifications,
}: {
  notifications: NotificationType[];
}) {
  return (
    <div className="notifications-container">
      {notifications.map((notification) => (
        <Notification key={notification.id} {...notification} />
      ))}
    </div>
  );
}

export default NotificationContainer;

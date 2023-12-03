import React from "react";
import Notification from "./Notification";

function NotificationContainer({
  notifications,
}: {
  notifications: Notification[];
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

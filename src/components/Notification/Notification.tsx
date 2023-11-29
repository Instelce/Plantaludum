import "./Notification.scss";
import { StatusProp } from "../../types/helpers";
import classNames from "classnames";
import { useEffect, useState } from "react";
import {
  NotificationType,
  useNotification,
} from "../../context/NotificationsProvider";
import Button from "../ui/Buttons/Button";
import { X } from "react-feather";

type NotificationProps = {
  index: number;
  notification: NotificationType;
};

function Notification({ index, notification }: NotificationProps) {
  const {removeNotification} = useNotification()
  const [remove, setRemove] = useState(false);
  const [durationProgress, setDurationProgress] = useState(0);

  useEffect(() => {
    const durationInterval = setInterval(() => {
      setDurationProgress((durationProgress) => durationProgress + 1);
    }, (notification.duration) / 100);

    const removeTimeout = setTimeout(() => {
      setRemove(true);
      removeNotification(index);
    }, notification.duration + 500);

    return () => {
      clearTimeout(removeTimeout);
      clearInterval(durationInterval);
    };
  }, []);

  return (
    <div
      className={classNames("notification", notification.status, {
        remove: remove,
      })}
    >
      <div className="flex sb center">
        {notification.message}
        <Button onlyIcon className="ml-2" size="small" color="gray" onClick={() => removeNotification(notification.id)}>
          <X />
        </Button>
      </div>
      <span style={{ width: durationProgress + "%" }}></span>
    </div>
  );
}

export default Notification;

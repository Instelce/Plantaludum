import "./Notification.scss";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import {
  notificationIcons,
  useNotification,
} from "../../../context/NotificationsProvider";
import Button from "../../Atoms/Buttons/Button";
import { X } from "react-feather";
import { StatusProp, TimeoutRef } from "../../../types/helpers";

type NotificationProps = {
  id: number;
  message: string;
  type: StatusProp;
  duration: number;
};

function Notification({ id, message, type, duration }: NotificationProps) {
  const notification = useNotification();
  const timerID = useRef<TimeoutRef | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    setTimeout(() => {
      notification.remove(id);
    }, 400);
  };

  const handleMouseEnter = () => {
    if (timerID.current) clearTimeout(timerID.current);

    if (progressRef.current)
      progressRef.current.style.animationPlayState = "paused";
  };

  const handleMouseLeave = () => {
    if (progressRef.current && progressRef.current.parentElement) {
      const remainingWidth =
        progressRef.current?.parentElement.offsetWidth -
        progressRef.current.offsetWidth;
      const remainingTime =
        (remainingWidth / progressRef.current.parentElement.offsetWidth) *
        duration;

      if (progressRef.current) {
        progressRef.current.style.animationPlayState = "running";
      }

      timerID.current = setTimeout(() => {
        handleDismiss();
      }, remainingTime);
    }
  };

  useEffect(() => {
    timerID.current = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => {
      clearTimeout(timerID.current);
    };
  }, []);

  return (
    <>
      <div
        className={classNames("notification", type, { dismiss: dismissed })}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex sb center">
          {notificationIcons[type]}
          <p className="ml-1">{message}</p>
          <Button
            onlyIcon
            bounce={false}
            className="ml-4"
            size="small"
            color="dark-gray"
            onClick={handleDismiss}
          >
            <X />
          </Button>
        </div>
        <span
          ref={progressRef}
          style={{ animation: "progress " + duration + "ms linear forwards" }}
        ></span>
      </div>
    </>
  );
}

export default Notification;

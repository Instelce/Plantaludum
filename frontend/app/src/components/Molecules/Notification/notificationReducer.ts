import { NotificationType } from "../../../context/NotificationsProvider";

export const notificationReducer = (state: {notifications: NotificationType[]}, action: {type: string, payload: any}) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case ("REMOVE_NOTIFICATION"): {
      const updatedNotifications = state.notifications.filter(
        (notification: NotificationType) => notification.id !== action.payload,
      );
      return {
        ...state,
        notifications: updatedNotifications,
      };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

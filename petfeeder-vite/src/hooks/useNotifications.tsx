export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    return permission;
  }
  return 'denied';
};

export const sendNotification = (title: string, options?: NotificationOptions) => {
  console.log('Try send notification, permission:', Notification.permission);
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, options);
  } else {
    console.log('Notification not sent, permission:', Notification.permission);
  }
};

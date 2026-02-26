export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    try {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      return permission;
    } catch (error) {
      // Handle potential errors in older browsers
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }
  return 'denied';
};

export const sendNotification = (title: string, options?: NotificationOptions) => {
  console.log('Try send notification, permission:', Notification.permission);
  if ('Notification' in window && Notification.permission === 'granted') {
    // Return the instance to allow closing it later if needed
    return new Notification(title, options);
  } else {
    console.log('Notification not sent, permission:', Notification.permission);
    return null;
  }
};
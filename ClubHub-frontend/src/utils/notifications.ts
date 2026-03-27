// utils/notifications.ts
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export const registerForPushNotificationsAsync = async (): Promise<string | null> => {
  if (!Constants.isDevice) {
    alert('É necessário um dispositivo físico para receber notificações');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Permissão para notificações negada!');
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Push Token:', token);
  return token;
};
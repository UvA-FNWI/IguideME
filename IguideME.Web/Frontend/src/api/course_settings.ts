import apiClient from './axios';
import { type NotificationAdminSettings } from '@/components/crystals/notification-settings/notification-settings';

export const getPeerSettings: () => Promise<{
  min_size: number;
}> = async () => await apiClient.get(`app/peer-groups`).then((response) => response.data);

export const postPeerSettings: (data: { min_size: number }) => Promise<void> = async (data: { min_size: number }) => {
  await apiClient.patch('app/peer-groups', data);
};

export const getConsentSettings: () => Promise<{
  course_name: string;
  text: string;
}> = async () => await apiClient.get(`app/course`).then((response) => response.data);

export const postConsentSettings: (data: { course_name: string; text: string }) => Promise<void> = async (data: {
  course_name: string;
  text: string;
}) => {
  await apiClient.patch(`app/consent`, data);
};

export const getNotificationSettings: () => Promise<NotificationAdminSettings> = async () => {
  return await apiClient.get('app/notifications').then((response) => response.data);
};

export const postNotificationSettings: (data: NotificationAdminSettings) => Promise<void> = async (
  data: NotificationAdminSettings,
) => {
  await apiClient.post('app/notifications', data);
};

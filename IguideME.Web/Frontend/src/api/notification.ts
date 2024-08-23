import type { Notifications } from '@/types/notification';

import { apiClient } from './axios';

export async function getNotifications(userID: string | undefined): Promise<Notifications | null> {
  if (!userID) return null;
  const response = await apiClient.get(`api/notification/${userID}`);
  return response.data as Notifications;
}

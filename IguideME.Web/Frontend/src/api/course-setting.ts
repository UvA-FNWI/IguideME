import type { NotificationAdminSettings } from '@/types/notification';

import { apiClient } from './axios';

// ------
// Peer Group
// ------

async function getPeerSettings(): Promise<{ min_size: number }> {
  const response = await apiClient.get('api/course/setting/peer-group');
  return response.data as { min_size: number };
}

async function postPeerSettings(data: { min_size: number }): Promise<void> {
  await apiClient.patch('api/course/setting/peer-group', data);
}

// ------
// Consent
// ------

async function getConsentSettings(): Promise<{ course_name: string; text: string }> {
  const response = await apiClient.get('api/course/setting/consent');
  return response.data as { course_name: string; text: string };
}

async function postConsentSettings(data: { course_name: string; text: string }): Promise<void> {
  await apiClient.patch('api/course/setting/consent', data);
}

// ------
// Notification
// ------

async function getNotificationSettings(): Promise<NotificationAdminSettings> {
  const response = await apiClient.get('api/course/setting/notification');
  return response.data as NotificationAdminSettings;
}

async function postNotificationSettings(data: NotificationAdminSettings): Promise<void> {
  await apiClient.post('api/course/setting/notification', data);
}

export {
  getConsentSettings,
  getNotificationSettings,
  getPeerSettings,
  postConsentSettings,
  postNotificationSettings,
  postPeerSettings,
};

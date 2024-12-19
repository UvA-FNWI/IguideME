import apiClient from './axios';
import { type NotificationAdminSettings } from '@/components/crystals/notification-settings/notification-settings';

export async function getPeerSettings(): Promise<{ min_size: number }> {
  return await apiClient.get(`app/peer-groups`).then((response) => response.data);
}

export async function postPeerSettings(data: { min_size: number }) {
  return await apiClient.patch('app/peer-groups', data);
}

export async function getConsentSettings(): Promise<{ course_name: string; text: string }> {
  return await apiClient.get(`app/course`).then((response) => response.data);
}

export async function postConsentSettings(data: { course_name: string; text: string }) {
  return await apiClient.patch(`app/consent`, data);
}

export async function getNotificationSettings(): Promise<NotificationAdminSettings> {
  return await apiClient.get('app/notifications').then((response) => response.data);
}

export async function postNotificationSettings(data: NotificationAdminSettings) {
  return await apiClient.post('app/notifications', data);
}

export async function getCourseDetailsSettings(): Promise<{ course_end_date: number }> {
  return await apiClient.get('app/course-details').then((response) => response.data);
}

export async function postCourseDetailsSettings(data: { course_end_date: number }) {
  return await apiClient.post('app/course-details', data);
}

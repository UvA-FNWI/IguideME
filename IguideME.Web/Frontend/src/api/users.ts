import {
  Notifications,
  NotificationStatus,
  StudentNotification,
  type CourseNotificationDetail,
} from '@/types/notifications';
import { type User } from '@/types/user';
import apiClient from './axios';

export async function getStudents(): Promise<User[]> {
  return await apiClient.get('students').then((response) => response.data);
}
export async function getStudentsWithSettings(): Promise<User[]> {
  return await apiClient.get('students/settings').then((response) => response.data);
}
export async function getStudent(id: string): Promise<User> {
  return await apiClient.get(`student/${id}`).then((response) => response.data);
}
export async function getSelf(): Promise<User> {
  return await apiClient.get('app/self').then((response) => response.data);
}
export async function getStudentNotifications(id: string): Promise<Notifications> {
  const data: StudentNotification[] = await apiClient
    .get(`app/notifications/user/${id}`)
    .then((response) => response.data);

  return {
    outperforming: data.filter((notification) => notification.status === NotificationStatus.outperforming),
    closing: data.filter((notification) => notification.status === NotificationStatus.closing_gap),
    falling: data.filter((notification) => notification.status === NotificationStatus.falling_behind),
    effort: data.filter((notification) => notification.status === NotificationStatus.more_effort),
  };
}
export async function getCourseNotifications(): Promise<Map<string, CourseNotificationDetail[]>> {
  return await apiClient.get(`app/notifications/course`).then((response) => response.data);
}

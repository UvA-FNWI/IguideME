import apiClient from './axios';
import { type CourseNotification, type Notifications } from '@/types/notifications';
import { type User } from '@/types/user';

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
  return await apiClient.get(`app/notifications/user/${id}`).then((response) => response.data);
}
export async function getCourseNotifications(): Promise<Map<number, CourseNotification>> {
  return await apiClient.get(`app/notifications/course`).then((response) => response.data);
}

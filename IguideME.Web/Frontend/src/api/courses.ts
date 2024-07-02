import { User } from '@/types/user';
import apiClient from './axios';

export enum WorkflowStates {
  UNPUBLISHED,
  AVAILABLE,
  COMPLETED,
}

export interface Course {
  id: number;
  name: string;
  courseCode: string;
  workflowState: WorkflowStates;
  isPublic: boolean;
  courseImage: string;
}

export async function getCourseById(courseId: string): Promise<Course> {
  return await apiClient.get(`/api/courses/${courseId}`).then((response) => response.data);
}

export async function getCoursesByUser(userId: string): Promise<Course[]> {
  return await apiClient.get(`/api/courses?userId=${userId}`).then((response) => response.data);
}

export async function getStudentsByCourse(courseId: string): Promise<User[]> {
  return await apiClient.get(`/api/courses/${courseId}/students`).then((response) => response.data);
}

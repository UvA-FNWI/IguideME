import type { Course } from '@/types/course';
import { type User } from '@/types/user';

import { apiClient } from './axios';

async function getCourseById(courseId: string | undefined): Promise<Course | null> {
  if (!courseId) return null;
  const response = await apiClient.get(`/api/course/${courseId}`);
  return response.data as Course;
}

async function getCoursesByUser(userId: string): Promise<Course[]> {
  const response = await apiClient.get(`/api/course?userId=${userId}`);
  return response.data as Course[];
}

async function getStudentsByCourse(courseId: string): Promise<User[]> {
  const response = await apiClient.get(`/api/course/${courseId}/student`);
  return response.data as User[];
}

export { getCourseById, getCoursesByUser, getStudentsByCourse };

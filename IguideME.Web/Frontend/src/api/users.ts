import { type User } from '@/types/user';

import { apiClient } from './axios';

async function getStudents(): Promise<User[]> {
  const response = await apiClient.get('api/user/student');
  return response.data as User[];
}

async function getStudent(id: string | undefined): Promise<User | null> {
  if (!id) return null;
  const response = await apiClient.get(`api/user/student/${id}`);
  return response.data as User;
}

async function getSelf(): Promise<User> {
  const response = await apiClient.get('api/user/self');
  return response.data as User;
}

async function getStudentsWithSettings(): Promise<User[]> {
  const response = await apiClient.get('students/settings');
  return response.data as User[];
}

interface TileGrade {
  tile_id: number;
  grade: number;
  max: number;
}

async function getAllUserTileGrades(): Promise<
  {
    userID: string;
    goal: number;
    tile_grades: TileGrade[];
  }[]
> {
  const response = await apiClient.get(`tiles/grades/`);
  return response.data as {
    userID: string;
    goal: number;
    tile_grades: TileGrade[];
  }[];
}

export { getAllUserTileGrades, getSelf, getStudent, getStudents, getStudentsWithSettings };

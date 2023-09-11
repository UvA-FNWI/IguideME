import apiClient from './axios';
import { type User } from '@/types/user';

export const getUsers: () => Promise<User[]> = async () => await apiClient.get(`students`).then((response) => response.data);

export const getSelf: () => Promise<User> = async () => await apiClient.get(`app/self`).then((response) => response.data);

import { type Notifications } from "@/types/notifications";
import apiClient from "./axios";
import { type UserSettings, type User } from "@/types/user";

export const getStudents: () => Promise<User[]> = async () =>
  await apiClient.get("students").then((response) => response.data);

export const getStudent: (id: string) => Promise<User> = async (id: string) =>
  await apiClient.get(`student/${id}`).then((response) => response.data);

export const getSelf: () => Promise<User> = async () =>
  await apiClient.get("app/self").then((response) => response.data);

export const getStudentSettings: (id: string) => Promise<UserSettings> = async (
  id: string,
) =>
  await apiClient.get(`app/settings/${id}`).then((response) => response.data);

export const getStudentNotifications: (
  id: string,
) => Promise<Notifications> = async (id: string) =>
  await apiClient
    .get(`app/notifications/${id}`)
    .then((response) => response.data);

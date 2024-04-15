import apiClient from './axios';

export const getNotificationSettings: () => Promise<boolean> = async () =>
  await apiClient.get('/student/settings/notifications').then((response) => response.data);

export const postNotificationSettings: (enabled: boolean) => Promise<void> = async (enabled: boolean) => {
  await apiClient.post('/student/settings/notifications', { enabled });
};

export const setGoalGrade: (grade: number) => Promise<void> = async (grade: number) => {
  await apiClient.post('/student/settings/goal-grade', { grade });
};

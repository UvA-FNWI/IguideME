import apiClient from './axios';

export const postNotificationSettings: (enabled: boolean) => Promise<void> = async (enabled: boolean) => {
  await apiClient.post('/student/settings/notifications', { enabled });
};

export const postConsentSettings: (enabled: boolean) => Promise<void> = async (enabled: boolean) => {
  await apiClient.post('/student/settings/consent', { enabled });
};

export const postGoalGrade: (grade: number) => Promise<void> = async (grade: number) => {
  await apiClient.post('/student/settings/goal-grade', { grade });
};

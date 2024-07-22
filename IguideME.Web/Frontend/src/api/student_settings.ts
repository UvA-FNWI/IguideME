import apiClient from './axios';

export async function postNotificationSettings(enabled: boolean): Promise<void> {
  return await apiClient.post('/student/settings/notifications', { enabled });
}

export async function postConsentSettings(enabled: boolean): Promise<void> {
  return await apiClient.post('/student/settings/consent', { enabled });
}

export async function postGoalGrade(grade: number): Promise<void> {
  return await apiClient.post('/student/settings/goal-grade', { grade });
}

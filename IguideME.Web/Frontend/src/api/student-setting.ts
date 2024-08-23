import { apiClient } from './axios';

async function postNotificationSettings(enabled: boolean): Promise<void> {
  await apiClient.post('/student/settings/notifications', { enabled });
}

async function postConsentSettings(enabled: boolean): Promise<void> {
  await apiClient.post('/student/settings/consent', { enabled });
}

async function postGoalGrade(grade: number): Promise<void> {
  await apiClient.post('/student/settings/goal-grade', { grade });
}

export { postConsentSettings, postGoalGrade, postNotificationSettings };

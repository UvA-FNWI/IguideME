import apiClient from './axios';

export async function postNotificationSettings(enabled: boolean): Promise<void> {
  await apiClient.post('/student/settings/notifications', { enabled });
}

export async function postConsentSettings(enabled: boolean): Promise<void> {
  await apiClient.post('/student/settings/consent', { enabled });
}

export async function postGoalGrade(grade: number): Promise<void> {
  await apiClient.post('/student/settings/goal-grade', { grade });
}

// Accept list shenanigans
export async function getAcceptedStudents(): Promise<Array<{ userID: string; accepted: boolean }>> {
  return await apiClient.get('/datamart/accept-list').then((response) => response.data);
}
export async function postAcceptedStudents(acceptList: Array<{ userID: string; accepted: boolean }>): Promise<void> {
  await apiClient.post('/datamart/accept-list', acceptList);
}
export async function getStudentAcceptStatus(userID: string): Promise<boolean> {
  return await apiClient.get(`/datamart/accept-list/${userID}`).then((response) => response.data);
}

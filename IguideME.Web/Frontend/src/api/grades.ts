import { DiscussionEntry, DiscussionTopic, Grades, LearningGoal, Submission, TileGrade } from '@/types/tile';
import apiClient from './axios';

export async function getCompareGrades(
  id: number,
  type: string,
): Promise<Array<{ userID: string; grade: number; max: number }>> {
  return await apiClient.get(`grades/${id}`, { params: { type } }).then((response) => response.data);
}

export async function getUserTileGrades(userID: string, tileID: number): Promise<Grades> {
  return await apiClient.get(`tiles/${tileID}/grades/${userID}`).then((response) => response.data);
}

export async function getAllUserTileGrades(): Promise<
  Array<{
    userID: string;
    goal: number;
    tile_grades: TileGrade[];
  }>
> {
  return await apiClient.get(`tiles/grades/`).then((response) => response.data);
}

export async function getDiscussionEntries(cid: number, uid: string): Promise<DiscussionTopic> {
  return await apiClient.get(`discussions/${cid}/${uid}`).then((response) => response.data);
}

export async function getAssignmentSubmission(cid: number, uid: string): Promise<Submission> {
  return await apiClient
    .get(`assignments/${cid}/submissions/${uid}`)
    .then((response) => (response.data !== '' ? response.data : undefined));
}
export async function getLearningGoal(cid: number, uid: string): Promise<LearningGoal> {
  return await apiClient.get(`learning-goals/${cid}/${uid}`).then((response) => response.data);
}
export async function getUserDiscussionEntries(uid: string): Promise<DiscussionEntry[]> {
  return await apiClient.get(`discussions/${uid}`).then((response) => response.data);
}

import {
  type Assignment,
  type DiscussionEntry,
  type DiscussionTopic,
  type GoalRequirement,
  type LearningGoal,
  type Submission,
} from '@/types/tile';

import { apiClient } from './axios';

// ------
// Assignments
// ------

async function getAssignments(): Promise<Map<number, Assignment>> {
  const response: { data: Record<string, Assignment> } = await apiClient.get('api/assignment');
  return new Map<number, Assignment>(Object.entries(response.data).map(([k, v]) => [Number(k), v]));
}

async function getAssignmentSubmission(cid: number, uid: string): Promise<Submission> {
  const response = await apiClient.get(`api/assignment/${String(cid)}/submission/${String(uid)}`);
  return response.data as Submission;
}

// ------
// Discussions
// ------

async function getTopics(): Promise<DiscussionTopic[]> {
  const response = await apiClient.get('api/discussion/topic');
  return response.data as DiscussionTopic[];
}

async function getDiscussionEntries(cid: number, studentNumber: string): Promise<DiscussionTopic> {
  const response = await apiClient.get(`api/discussion/${String(cid)}/${studentNumber}`);
  return response.data as DiscussionTopic;
}

async function getUserDiscussionEntries(uid: string): Promise<DiscussionEntry[]> {
  const response = await apiClient.get(`api/discussion/${uid}`);
  return response.data as DiscussionEntry[];
}

// ------
// Learning Goals
// ------

async function getLearningGoals(): Promise<LearningGoal[]> {
  const response = await apiClient.get('api/learning-goal');
  return response.data as LearningGoal[];
}

async function getLearningGoal(cid: number, studentNumber: string): Promise<LearningGoal> {
  const response = await apiClient.get(`api/learning-goal/${String(cid)}/${studentNumber}`);
  return response.data as LearningGoal;
}

async function postLearningGoal(goal: LearningGoal): Promise<void> {
  await apiClient.post(`api/learning-goal/${String(goal.id)}`, goal);
}

async function patchLearningGoal(goal: LearningGoal): Promise<void> {
  await apiClient.patch(`api/learning-goal/${String(goal.id)}`, goal);
}

async function deleteLearningGoal(id: number): Promise<void> {
  await apiClient.delete(`api/learning-goal/${String(id)}`);
}

// ------
// Goal Requirements
// ------

async function postGoalRequirement(requirement: GoalRequirement): Promise<void> {
  await apiClient.post(`api/learning-goal/requirement/${String(requirement.id)}`, requirement);
}

async function patchGoalRequirement(requirement: GoalRequirement): Promise<void> {
  await apiClient.patch(`api/learning-goal/requirement/${String(requirement.id)}`, requirement);
}

async function deleteRequirement(id: number): Promise<void> {
  await apiClient.delete(`api/learning-goal/requirement/${String(id)}`);
}

export {
  deleteLearningGoal,
  deleteRequirement,
  getAssignments,
  getAssignmentSubmission,
  getDiscussionEntries,
  getLearningGoal,
  getLearningGoals,
  getTopics,
  getUserDiscussionEntries,
  patchGoalRequirement,
  patchLearningGoal,
  postGoalRequirement,
  postLearningGoal,
};

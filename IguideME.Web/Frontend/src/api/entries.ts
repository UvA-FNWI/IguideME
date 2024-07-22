import apiClient from './axios';
import { type DiscussionTopic, type Assignment, type LearningGoal, type GoalRequirement } from '@/types/tile';

type GetAssignmentsData = Record<string, Assignment>;

export async function getAssignments(): Promise<Map<number, Assignment>> {
  return await apiClient.get(`assignments`).then((response: { data: GetAssignmentsData }) => {
    return new Map<number, Assignment>(Object.entries(response.data).map(([k, v]) => [+k, v]));
  });
}
export async function getTopics(): Promise<DiscussionTopic[]> {
  return await apiClient.get('topics').then((response) => response.data);
}
export async function getLearningGoals(): Promise<LearningGoal[]> {
  return await apiClient.get('learning-goals').then((response) => response.data);
}

export async function postLearningGoal(goal: LearningGoal): Promise<void> {
  return await apiClient.post(`learning-goals/${goal.id}`, goal);
}

export async function patchLearningGoal(goal: LearningGoal): Promise<void> {
  return await apiClient.patch(`learning-goals/${goal.id}`, goal);
}

export async function deleteLearningGoal(id: number): Promise<void> {
  return await apiClient.delete(`learning-goals/${id}`);
}

export async function postGoalRequirement(requirement: GoalRequirement): Promise<void> {
  return await apiClient.post(`learning-goals/requirements/${requirement.id}`, requirement);
}

export async function patchGoalRequirement(requirement: GoalRequirement): Promise<void> {
  return await apiClient.patch(`learning-goals/requirements/${requirement.id}`, requirement);
}

export async function deleteRequirement(id: number): Promise<void> {
  return await apiClient.delete(`learning-goals/requirements/${id}`);
}

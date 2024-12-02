import { type Assignment, type DiscussionTopic, type GoalRequirement, type LearningGoal } from '@/types/tile';
import apiClient from './axios';
import type { ExternalSubmission } from '@/types/grades';

type GetAssignmentsData = Record<string, Assignment>;

export async function getAssignments(): Promise<Map<number, Assignment>> {
  return await apiClient.get(`assignments`).then((response: { data: GetAssignmentsData }) => {
    return new Map<number, Assignment>(Object.entries(response.data).map(([k, v]) => [+k, v]));
  });
}
export async function getExternalAssignments(): Promise<Assignment[]> {
  return await apiClient.get('external-assignments').then((response) => response.data);
}

export async function getExternalAssignmentSubmissions(assignmentId: number): Promise<ExternalSubmission[]> {
  return await apiClient.get(`assignments/${assignmentId}/submissions`).then((response) => response.data);
}

export async function postExternalAssignment(ass: Assignment): Promise<void> {
  await apiClient.post(`external-assignments`, ass);
}

export async function getTopics(): Promise<DiscussionTopic[]> {
  return await apiClient.get('topics').then((response) => response.data);
}
export async function getLearningGoals(): Promise<LearningGoal[]> {
  return await apiClient.get('learning-goals').then((response) => response.data);
}

export async function postLearningGoal(goal: LearningGoal): Promise<void> {
  await apiClient.post(`learning-goals/${goal.id}`, goal);
}

export async function patchLearningGoal(goal: LearningGoal): Promise<void> {
  await apiClient.patch(`learning-goals/${goal.id}`, goal);
}

export async function deleteLearningGoal(id: number): Promise<void> {
  await apiClient.delete(`learning-goals/${id}`);
}

export async function postGoalRequirement(requirement: GoalRequirement): Promise<void> {
  await apiClient.post(`learning-goals/requirements/${requirement.id}`, requirement);
}

export async function patchGoalRequirement(requirement: GoalRequirement): Promise<void> {
  await apiClient.patch(`learning-goals/requirements/${requirement.id}`, requirement);
}

export async function deleteRequirement(id: number): Promise<void> {
  await apiClient.delete(`learning-goals/requirements/${id}`);
}

export async function patchExternalAssignment(assignment: Assignment): Promise<void> {
  await apiClient.patch(`external-assignments/${assignment.id}`, assignment);
}

export async function patchExternalAssignmentTitle({ id, title }: { id: number; title: string }): Promise<void> {
  await apiClient.patch(`external-assignments/${id}/title`, { title });
}

export async function deleteExternalAssignment({ assignmentID }: { assignmentID: number }): Promise<void> {
  await apiClient.delete(`external-assignments/${assignmentID}`);
}

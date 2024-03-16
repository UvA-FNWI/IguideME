import {
  type Discussion,
  type Assignment,
  type LearningGoal,
  type GoalRequirement,
  type Submission,
} from "@/types/tile";
import apiClient from "./axios";

export const getAssignments: () => Promise<
  Map<number, Assignment>
> = async () =>
  await apiClient.get(`assignments`).then((response) => {
    return new Map<number, Assignment>(
      Object.entries(response.data).map(([k, v]) => [+k, v as Assignment]),
    );
  });

export const getTopics: () => Promise<Discussion[]> = async () =>
  await apiClient.get(`topics`).then((response) => response.data);

export const getDiscussion: (
  cid: number,
  uid: string,
) => Promise<Discussion> = async (cid: number, studentnr: string) =>
  await apiClient
    .get(`discussions/${cid}/${studentnr}`)
    .then((response) => response.data);

export const getLearningGoals: () => Promise<LearningGoal[]> = async () =>
  await apiClient.get(`learning-goals`).then((response) => response.data);

export const postLearningGoal: (goal: LearningGoal) => Promise<void> = async (
  goal: LearningGoal,
) => {
  await apiClient.post(`learning-goals/${goal.id}`, goal);
};

export const patchLearningGoal: (goal: LearningGoal) => Promise<void> = async (
  goal: LearningGoal,
) => {
  await apiClient.patch(`learning-goals/${goal.id}`, goal);
};

export const deleteLearningGoal: (id: number) => Promise<void> = async (
  id: number,
) => {
  await apiClient.delete(`learning-goals/${id}`);
};

export const postGoalRequirement: (
  requirement: GoalRequirement,
) => Promise<void> = async (requirement: GoalRequirement) => {
  await apiClient.post(
    `learning-goals/requirements/${requirement.id}`,
    requirement,
  );
};

export const patchGoalRequirement: (
  requirement: GoalRequirement,
) => Promise<void> = async (requirement: GoalRequirement) => {
  await apiClient.patch(
    `learning-goals/requirements/${requirement.id}`,
    requirement,
  );
};

export const deleteRequirement: (id: number) => Promise<void> = async (
  id: number,
) => {
  await apiClient.delete(`learning-goals/requirements/${id}`);
};

export const getAssignmentSubmission: (
  cid: number,
  uid: string,
) => Promise<Submission> = async (cid: number, uid: string) =>
  await apiClient
    .get(`assignments/${cid}/submissions/${uid}`)
    .then((response) => (response.data !== "" ? response.data : undefined));

import {
  type Discussion,
  type Assignment,
  type LearningGoal,
} from "@/types/tile";
import apiClient from "./axios";

export const getAssignments: () => Promise<
  Map<number, Assignment>
> = async () =>
  await apiClient
    .get(`assignments`)
    .then(
      (response) =>
        new Map<number, Assignment>(
          Object.entries(response.data).map(([k, v]) => [+k, v as Assignment]),
        ),
    );

export const getTopics: () => Promise<Discussion[]> = async () =>
  await apiClient.get(`topics`).then((response) => response.data);

export const getLearningGoals: () => Promise<LearningGoal[]> = async () =>
  await apiClient.get(`learning-goals`).then((response) => response.data);

export const postLearningGoal: (goal: LearningGoal) => Promise<void> = async (
  goal: LearningGoal,
) => {
  await apiClient.post(`learning-goals/${goal.id}`, goal);
};

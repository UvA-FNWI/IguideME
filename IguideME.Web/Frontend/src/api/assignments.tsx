import { type Discussion, type Assignment, type LearningGoal } from '@/types/tile';
import apiClient from './axios';

export const getAssignments: () => Promise<Assignment[]> = async () =>
	await apiClient.get(`assignments`).then((response) => response.data);

export const getTopDiscussions: () => Promise<Discussion[]> = async () =>
	await apiClient.get(`topdiscussions`).then((response) => response.data);

export const getLearningGoals: () => Promise<LearningGoal[]> = async () =>
	await apiClient.get(`learning-goals`).then((response) => response.data);

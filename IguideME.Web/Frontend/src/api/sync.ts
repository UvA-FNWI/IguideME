import type { Job, JobModel, Synchronization } from '@/types/sync';

import { apiClient } from './axios';

async function getSynchronizations(): Promise<Synchronization[]> {
  const response = await apiClient.get('api/datamart/synchronizations');
  return response.data as Synchronization[];
}

async function pollSync(): Promise<JobModel[] | null> {
  const response = await apiClient.get('api/datamart/status');
  if (!response.data) return null;

  return Object.values(response.data as Record<string, Job>).map((job: Job) => {
    return {
      startTime: Number(job.startTime),
      lastUpdate: Number(job.lastUpdate),
      task: job.progressInformation,
      status: job.status,
    };
  }) as JobModel[];
}

// TODO: Implement the following functions

async function startNewSync(): Promise<void> {
  await apiClient.post('api/datamart/start-sync', {});
}

async function stopCurrentSync(): Promise<void> {
  await apiClient.post('api/datamart/stop-sync', {});
}

export { getSynchronizations, pollSync, startNewSync, stopCurrentSync };

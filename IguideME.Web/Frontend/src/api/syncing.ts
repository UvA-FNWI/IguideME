import apiClient from './axios';
import { type JobModel, type Synchronization } from '@/types/synchronization';

export const getSynchronizations: () => Promise<Synchronization[]> = async () =>
  await apiClient.get('datamart/synchronizations').then((response) => response.data);

interface Job {
  startTime: string;
  lastUpdate: string;
  progressInformation: string;
  status: string;
}

type PollSyncData = Record<string, Job>;
export const pollSync: () => Promise<JobModel[]> = async () =>
  await apiClient.get('datamart/status').then((response) => {
    if (response.data === null || response.data === undefined) {
      return response.data;
    }

    return Object.values(response.data as PollSyncData).map((job: Job) => {
      return {
        startTime: job.startTime,
        lastupdate: job.lastUpdate,
        task: job.progressInformation,
        status: job.status,
      };
    });
  });

// TODO: figure out the typing here to be cleaner
export const startNewSync: () => Promise<any> = async () => await apiClient.post('datamart/start-sync', {});

export const stopCurrentSync: () => Promise<any> = async () => await apiClient.post('datamart/stop-sync', {});

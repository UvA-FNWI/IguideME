import apiClient from "./axios"
import { JobModel, Synchronization } from "@/types/synchronization"


export let getSynchronizations: () => Promise<Synchronization[]> = () => apiClient.get(
    `datamart/synchronizations`
  ).then(response => response.data);

export let pollSync: () => Promise<JobModel[]> = () => apiClient.get(
    `datamart/status`
  ).then(response => {
    if (!response.data) {
      return response.data;
    }

    return Object.values(response.data).map((job: any) => { return {
      startTime: job.startTime,
      lastupdate: job.lastUpdate,
      task: job.progressInformation,
      status: job.status
    }});

  });

// TODO: figure out the typing here to be cleaner
export let startNewSync: () => Promise<any> = () => apiClient.post(
  `datamart/start-sync`, {}
);

export let stopCurrentSync: () => Promise<any> = () => apiClient.post(
  `datamart/stop-sync`, {}
);

import { type AxiosResponse } from 'axios';

import { apiClient } from './axios';

export async function setup(): Promise<AxiosResponse> {
  return apiClient.post('api/setup');
}

import apiClient from './axios';
import { type AxiosResponse } from 'axios';

export default async function setup(): Promise<AxiosResponse<any, any>> {
  return await apiClient.post('app/setup');
}

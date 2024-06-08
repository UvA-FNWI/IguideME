import apiClient from './axios';
import { type AxiosResponse } from 'axios';

const setup = async (): Promise<AxiosResponse<any, any>> => await apiClient.post('app/setup');
export default setup;

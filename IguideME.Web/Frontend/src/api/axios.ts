import axios from 'axios';

const getBaseURL = (): string => {
  if (!process.env.NEXT_PUBLIC_BASE_URL) throw new Error('BASE_URL is not defined');
  return process.env.NEXT_PUBLIC_BASE_URL;
};

const getAuthToken = (): string => {
  return process.env.AUTH_TOKEN ?? '';
};

// automatically set the base url of each request to the current host
export const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: { Authorization: `Bearer ${getAuthToken()}` },
});

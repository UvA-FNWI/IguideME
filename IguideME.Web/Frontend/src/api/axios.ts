import axios from 'axios';

const baseURL = (): string => {
	return `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
};

// automatically set the base url of each request to the current host
const apiClient = axios.create({
	baseURL: baseURL(),
	headers: { Authorization: `Bearer ${document.location.hash.slice(1)}` },
});

export default apiClient;

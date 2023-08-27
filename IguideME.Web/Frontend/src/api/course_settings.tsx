import apiClient from "./axios";

export let getPeerSettings: () => Promise<{min_size: number, personalized_peers: boolean}> = () => apiClient.get(
    `app/peer-groups`
).then(response => response.data);

export let postPeerSettings: (data: {min_size: number, personalized_peers: boolean}) => Promise<void> = (data: {min_size: number, personalized_peers: boolean}) => apiClient.patch(
  `app/peer-groups`, data
);

export let getConsentSettings: () => Promise<{course_name: string, text: string}> = () => apiClient.get(
  `app/course`
).then(response => response.data);

export let postConsentSettings: (data: {course_name: string, text: string}) => Promise<void> = (data: {course_name: string, text: string}) => apiClient.patch(
  `app/consent`, data
);

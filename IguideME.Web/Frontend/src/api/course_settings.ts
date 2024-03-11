import apiClient from "./axios";

export const getPeerSettings: () => Promise<{
  min_size: number;
  personalized_peers: boolean;
}> = async () =>
  await apiClient.get(`app/peer-groups`).then((response) => response.data);

export const postPeerSettings: (data: {
  min_size: number;
  personalized_peers: boolean;
}) => Promise<void> = async (data: {
  min_size: number;
  personalized_peers: boolean;
}) => {
  await apiClient.patch("app/peer-groups", data);
};

// export const getConsentSettings: () => Promise<{
//   course_name: string;
//   text: string;
// }> = async () =>
//   await apiClient.get(`app/course`).then((response) => response.data);

// export const postConsentSettings: (data: {
//   course_name: string;
//   text: string;
// }) => Promise<void> = async (data: { course_name: string; text: string }) => {
//   await apiClient.patch(`app/consent`, data);
// };

export const getNotificationSettings: () => Promise<string[]> = async () =>
  await apiClient.get("app/notifications").then((response) => response.data);

export const postNotificationSettings: (
  dates: string,
) => Promise<void> = async (dates: string) => {
  await apiClient.post("app/notifications", { dates });
};

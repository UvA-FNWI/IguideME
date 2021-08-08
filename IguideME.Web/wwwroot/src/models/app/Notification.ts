export type NotificationStatus = "outperforming peers" | "closing the gap" | "more effort required";

export interface PerformanceNotification {
  tile_id: number;
  status: NotificationStatus;
}
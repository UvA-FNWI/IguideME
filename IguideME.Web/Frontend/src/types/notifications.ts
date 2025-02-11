export enum NotificationStatus {
  outperforming,
  closing_gap,
  falling_behind,
  more_effort,
}

export interface StudentNotification {
  tile_title: string;
  status: NotificationStatus;
}

export interface Notifications {
  outperforming: StudentNotification[];
  closing: StudentNotification[];
  falling: StudentNotification[];
  effort: StudentNotification[];
}

export type NotificationMap = Record<string, CourseNotificationDetail[]>;

export interface CourseNotificationDetail {
  tile_title: string;
  status: NotificationStatus;
  sent: number | null;
}

export enum NotificationStatus {
  outperforming,
  closing_gap,
  falling_behind,
  more_effort,
}

export interface StudentNotification {
  userID: string;
  tile_id: number;
  tile_title: string;
  status: NotificationStatus;
  sent: boolean;
}

export interface Notifications {
  outperforming: StudentNotification[];
  closing: StudentNotification[];
  falling: StudentNotification[];
  effort: StudentNotification[];
}

enum NotificationStatus {
  Outperforming,
  ClosingGap,
  FallingBehind,
  MoreEffort,
}

interface StudentNotification {
  userID: string;
  tile_id: number;
  tile_title: string;
  status: NotificationStatus;
  sent: boolean;
}

interface Notifications {
  outperforming: StudentNotification[];
  closing: StudentNotification[];
  falling: StudentNotification[];
  effort: StudentNotification[];
}

interface NotificationAdminSettings {
  isRange: boolean;
  selectedDays: string | null;
  selectedDates: string | null;
}

export { NotificationStatus };
export type { NotificationAdminSettings, Notifications, StudentNotification };

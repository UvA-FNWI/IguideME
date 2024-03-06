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

// export class Data {
//   key: string;
//   name: string;
//   current: Notifications;
//   previous: Notifications;
//   enabled: boolean;

//   constructor(key: string, name: string, enabled: boolean) {
//     this.key = key;
//     this.name = name;
//     this.current = { outperforming: [], more_effort: [], closing: [] };
//     this.previous = { outperforming: [], more_effort: [], closing: [] };
//     this.enabled = enabled;
//   }

//   toObject() {
//     return {
//       key: this.key,
//       name: this.name,
//       current: this.current,
//       previous: this.previous,
//       enabled: this.enabled,
//     };
//   }
// }

export type NotificationStatus = "outperforming peers" | "closing the gap" | "more effort required";

export interface PerformanceNotification {
  userID: string;
  tile_id: number;
  status: NotificationStatus;
  sent: boolean;
}

export interface Notifications {
  outperforming: PerformanceNotification[],
  more_effort: PerformanceNotification[],
  closing: PerformanceNotification[]
}

export class Data {
  key: string;
  name: string;
  current: Notifications;
  previous: Notifications;
  enabled: boolean;

  constructor(key: string, name: string, enabled: boolean) {
    this.key = key;
    this.name = name;
    this.current = {outperforming: [], more_effort: [], closing: []};
    this.previous = {outperforming: [], more_effort: [], closing: []};
    this.enabled = enabled;
  }

  toObject() {
    return {
      key: this.key,
      name: this.name,
      current: this.current,
      previous: this.previous,
      enabled: this.enabled
    };
  }

}

import React from "react";
import Controller from "../controller";

export interface Notifications {
    key: React.Key;
    student: string;
    notifications: string;
    notifications_enabled: string;
}

export default class NotificationCentreController extends Controller {

  static getNotifications(): Promise<Notifications[]> {

    // return this.client.get(
    //   `notifications`
    // ).then(response => response.data);
    return new Promise<Notifications[]>((resolve, reject) => {
        resolve([
        {
          key: '1',
          student: 'Test1',
          notifications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          notifications_enabled: "Yes",
        },
        {
          key: '2',
          student: 'Test2',
          notifications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          notifications_enabled: "Yes",
        },
      ]);
    });
  }
}
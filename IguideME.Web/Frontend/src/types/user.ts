export enum UserRoles {
  student,
  instructor,
}

export interface User {
  course_id: number;
  studentnumber: number;
  userID: string;
  name: string;
  sortable_name: string;
  role: UserRoles;
  settings: UserSettings | undefined;
}

export enum ConsentEnum {
  None,
  Accepted,
  Refused,
}

export interface UserSettings {
  goal_grade: number;
  predicted_grade: number;
  total_grade: number;
  consent: ConsentEnum;
  notifications: boolean;
}

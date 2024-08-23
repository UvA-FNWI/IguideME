enum UserRoles {
  Student,
  Instructor,
}

interface User {
  course_id: number;
  studentnumber: number;
  userID: string;
  name: string;
  sortable_name: string;
  role: UserRoles;
  settings: UserSettings | undefined;
}

interface UserSettings {
  goal_grade: number;
  predicted_grade: number;
  total_grade: number;
  consent: boolean;
  notifications: boolean;
}

export { UserRoles };
export type { User, UserSettings };

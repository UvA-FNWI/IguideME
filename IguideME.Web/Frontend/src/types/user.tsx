export enum UserRoles {
    student,
    instructor
}

export type User = {
    course_id: number;
    studentnumber: number;
    userID: string;
    name: string;
    sortable_name: string;
    role: UserRoles;
    consent: boolean | null;
    goal_grade: number;
};

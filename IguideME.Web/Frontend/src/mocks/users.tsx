import { UserRoles } from "@/types/user";
import { http, HttpResponse } from "msw";

export const userHandlers = [
  http.get("app/self", () => {
    return HttpResponse.json({
      course_id: 994,
      studentnumber: 42,
      userID: 42,
      name: "Course Admin",
      sortable_name: "Admin, Course",
      role: UserRoles.instructor,
      consent: null,
      goal_grade: null,
    });
  }),
];

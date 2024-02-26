import { type Submission } from "@/types/tile";
import { http, HttpResponse } from "msw";
import { MOCK_QUIZ_SUBMISSIONS } from "./submissions/quizzes";
import { MOCK_PERUSALL_SUBMISSIONS } from "./submissions/perusal";
import { MOCK_ATTENDANCE } from "./submissions/attendance";
import { MOCK_PRACTICE_SESSIONS } from "./submissions/practice-sessions";
import { MOCK_EXAMS } from "./submissions/exams";

export const gradeHandlers = [];

const MOCK_SUBMISSIONS: Submission[] = [
  ...MOCK_QUIZ_SUBMISSIONS,
  ...MOCK_PERUSALL_SUBMISSIONS,
  ...MOCK_ATTENDANCE,
  ...MOCK_PRACTICE_SESSIONS,
  ...MOCK_EXAMS,
];

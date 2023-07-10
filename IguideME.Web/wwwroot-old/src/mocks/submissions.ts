import { MOCK_QUIZ_SUBMISSIONS } from "./submissions/quizzes";
import { MOCK_PERUSALL_SUBMISSIONS } from "./submissions/perusall";
import { MOCK_ATTENDANCE } from "./submissions/attendance";
import { MOCK_PRACTICE_SESSIONS } from "./submissions/practiceSessions";
import { MOCK_EXAMS } from "./submissions/exams";

export const MOCK_SUBMISSIONS = [
  ...MOCK_QUIZ_SUBMISSIONS,
  ...MOCK_PERUSALL_SUBMISSIONS,
  ...MOCK_ATTENDANCE,
  ...MOCK_PRACTICE_SESSIONS,
  ...MOCK_EXAMS
]
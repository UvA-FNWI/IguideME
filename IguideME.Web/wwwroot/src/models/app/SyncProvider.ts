export enum SyncProvider {
  'BOOT_UP' = 'tasks.boot-up',
  'STUDENTS' = 'tasks.students',
  'QUIZZES' = 'tasks.quizzes',
  'DISCUSSIONS' = 'tasks.discussions',
  'ASSIGNMENTS' = 'tasks.assignments',
  'SUBMISSIONS' = 'tasks.submissions',
  'GRADE_PREDICTOR' = 'tasks.grade-predictor',
  'PEER_GROUPS' = 'tasks.peer-groups',
  'DONE' = 'tasks.done'
}

export interface Synchronization {
  key: string,
  start_timestamp: string,
  end_timestamp: string | null,
  hash: string,
  duration: string,
  invoked: string,
  status: string
}
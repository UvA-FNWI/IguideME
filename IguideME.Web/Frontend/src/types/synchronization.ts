export interface Synchronization {
  start_timestamp: number;
  end_timestamp: number | null;
  invoked: string;
  status: string;
}

export enum SyncStateNames {
  'BOOT_UP' = 'tasks.boot-up',
  'STUDENTS' = 'tasks.students',
  'QUIZZES' = 'tasks.quizzes',
  'DISCUSSIONS' = 'tasks.discussions',
  'ASSIGNMENTS' = 'tasks.assignments',
  // 'SUBMISSIONS' = 'tasks.submissions',
  'GRADE_PREDICTOR' = 'tasks.grade-predictor',
  'PEER_GROUPS' = 'tasks.peer-groups',
  'NOTIFICATIONS' = 'tasks.notifications',
  'DONE' = 'tasks.done',
}

interface State {
  title: string;
  busy_text: string;
  finished_text: string;
}

// export Map<string, State[]>
export const SyncStates = new Map<string, State>([
  [SyncStateNames.BOOT_UP, { title: 'Boot-up', busy_text: 'Starting a new sync...', finished_text: 'Sync started.' }],
  [
    SyncStateNames.STUDENTS,
    { title: 'Students', busy_text: 'Registering enrolled students...', finished_text: 'Registration complete.' },
  ],
  [
    SyncStateNames.QUIZZES,
    { title: 'Quizzes', busy_text: 'Querying available quizzes...', finished_text: 'Quizzes queried.' },
  ],
  [
    SyncStateNames.DISCUSSIONS,
    {
      title: 'Discussions',
      busy_text: 'Distinguishing posted discussions...',
      finished_text: 'Discussions distinguished.',
    },
  ],
  [
    SyncStateNames.ASSIGNMENTS,
    { title: 'Assignments', busy_text: 'Acquiring available assignments...', finished_text: 'Assignments acquired.' },
  ],
  // [
  // 	SyncStateNames.SUBMISSIONS,
  // 	{ title: 'Submissions', busy_text: 'Retrieving students submissions...', finished_text: 'Submissions retrieved.' },
  // ],
  [
    SyncStateNames.PEER_GROUPS,
    { title: 'Peer Groups', busy_text: 'Assigning peer groups...', finished_text: 'Peer groups assigned.' },
  ],
  [
    SyncStateNames.NOTIFICATIONS,
    {
      title: 'Notifications',
      busy_text: 'Creating performance notifications...',
      finished_text: 'Notifications created.',
    },
  ],
  [SyncStateNames.DONE, { title: 'Done', busy_text: 'Cleaning up...', finished_text: 'Finished synchronizations.' }],
]);

export enum JobStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Success = 'Success',
  Errored = 'Errored',
  Unknown = 'Unknown',
}

export type PollSyncData = Record<string, Job>;

export interface Job {
  startTime: string;
  lastUpdate: string;
  progressInformation: string;
  status: string;
}

export interface JobModel {
  startTime: number;
  lastUpdate: number;
  task: string;
  status: JobStatus;
}

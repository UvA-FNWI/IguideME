interface Job {
  startTime: string;
  lastUpdate: string;
  progressInformation: string;
  status: string;
}

interface Synchronization {
  start_timestamp: number;
  end_timestamp: number | null;
  invoked: string;
  status: string;
}

enum SyncStateNames {
  BootUp = 'tasks.boot-up',
  Students = 'tasks.students',
  Quizzes = 'tasks.quizzes',
  Discussions = 'tasks.discussions',
  Assignments = 'tasks.assignments',
  GradePredictor = 'tasks.grade-predictor',
  PeerGroups = 'tasks.peer-groups',
  Notifications = 'tasks.notifications',
  Done = 'tasks.done',
}

interface Status {
  title: string;
  busy_text: string;
  finished_text: string;
}

const SyncStates = new Map<string, Status>([
  [SyncStateNames.BootUp, { title: 'Boot-up', busy_text: 'Starting a new sync...', finished_text: 'Sync started.' }],
  [
    SyncStateNames.Students,
    { title: 'Students', busy_text: 'Registering enrolled students...', finished_text: 'Registration complete.' },
  ],
  [
    SyncStateNames.Quizzes,
    { title: 'Quizzes', busy_text: 'Querying available quizzes...', finished_text: 'Quizzes queried.' },
  ],
  [
    SyncStateNames.Discussions,
    {
      title: 'Discussions',
      busy_text: 'Distinguishing posted discussions...',
      finished_text: 'Discussions distinguished.',
    },
  ],
  [
    SyncStateNames.Assignments,
    { title: 'Assignments', busy_text: 'Acquiring available assignments...', finished_text: 'Assignments acquired.' },
  ],
  [
    SyncStateNames.GradePredictor,
    { title: 'Grade Prediction', busy_text: 'Predicting potential grades...', finished_text: 'Grades predicted.' },
  ],
  [
    SyncStateNames.PeerGroups,
    { title: 'Peer Groups', busy_text: 'Assigning peer groups...', finished_text: 'Peer groups assigned.' },
  ],
  [
    SyncStateNames.Notifications,
    {
      title: 'Notifications',
      busy_text: 'Creating performance notifications...',
      finished_text: 'Notifications created.',
    },
  ],
  [SyncStateNames.Done, { title: 'Done', busy_text: 'Cleaning up...', finished_text: 'Finished synchronizations.' }],
]);

enum JobStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Success = 'Success',
  Errored = 'Errored',
  Unknown = 'Unknown',
}

interface JobModel {
  startTime: number;
  lastUpdate: number;
  task: string;
  status: JobStatus;
}

export type { Job, JobModel, Synchronization };
export { JobStatus, SyncStateNames, SyncStates };

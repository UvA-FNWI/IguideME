enum WorkflowStates {
  UNPUBLISHED,
  AVAILABLE,
  COMPLETED,
}

interface Course {
  id: number;
  name: string;
  courseCode: string;
  workflowState: WorkflowStates;
  isPublic: boolean;
  courseImage: string;
}

export { WorkflowStates };
export type { Course };

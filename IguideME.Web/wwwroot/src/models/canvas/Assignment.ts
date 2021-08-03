export interface CanvasAssignment {
  id: number;
  course_id: number;
  name: string;
  grading_type: string;
  published: boolean;
  points_possible: number;
  submission_types: string[];
  assignment_group_id: number;
  position: number;
}
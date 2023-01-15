export enum discussionType {
  topic,
  entry,
  reply
}

export interface CanvasDiscussion {
  id: number;
  type: discussionType;
  discussion_id: number;
  parent_id: number;
  course_id: number;
  title: string;
  posted_at: string;
  posted_by: string;
  message: string;
}
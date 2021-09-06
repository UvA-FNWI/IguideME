export interface Course {
  course_name: string;
  require_consent: boolean;
  text: string | null;
  accept_list: boolean;
}
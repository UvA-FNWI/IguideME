import AppController from "../../api/controllers/app";

export class CourseActions {

  static SET_COURSE_SUCCESS = "SET_COURSE_SUCCESS";
  static SET_COURSE_ERROR = "SET_COURSE_ERROR";

  static loadCourse = async () => {
    const course = await AppController.getCourse();

    if (course)
      return {
        type: CourseActions.SET_COURSE_SUCCESS,
        payload: course
      }

    return {
      type: CourseActions.SET_COURSE_ERROR,
    }
  }
}
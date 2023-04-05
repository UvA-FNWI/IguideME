import moment from "moment";
import { SyncProvider } from "../../../models/app/SyncProvider";

export const elapsedTime = (start: moment.Moment | undefined) => {
  if (!start) return undefined;

  return moment(moment.utc().diff(start)).utcOffset(0).format("HH:mm:ss");
}

// TODO: change to a enum or dict/map probably.
export const syncStates = [
  {
    id: SyncProvider.BOOT_UP, title: "Boot-up", description: "Establish a connection."
  }, {
    id: SyncProvider.STUDENTS, title: "Students", description: "Register enrolled students."
  }, {
    id: SyncProvider.QUIZZES, title: "Quizzes", description: "Obtain available quizzes."
  }, {
    id: SyncProvider.DISCUSSIONS, title: "Discussions", description: "Obtain posted discussions."
  }, {
    id: SyncProvider.ASSIGNMENTS, title: "Assignments", description: "Obtain available assignments."
  }, {
    id: SyncProvider.SUBMISSIONS, title: "Submissions", description: "Obtain submissions from students."
  }, {
    id: SyncProvider.GRADE_PREDICTOR, title: "Grade Prediction", description: "Predict grade per student."
  }, {
    id: SyncProvider.PEER_GROUPS, title: "Peer Groups", description: "Assign student peer groups."
  }, {
    id: SyncProvider.NOTIFICATIONS, title: "Notifications", description: "Send performance notifications to the students."
  }
]

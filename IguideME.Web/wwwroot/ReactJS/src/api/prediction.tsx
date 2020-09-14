import axios, {AxiosResponse} from "axios";
import {ITile} from "../models/ITile";

export default class PredictionController {

  static predict(tiles: ITile[]): Promise<AxiosResponse> {

    const exams: ITile | undefined = tiles.find((tile: ITile) => tile.name === "Exam grades");
    const deeltoets_1 = (exams && exams.entries.length > 0) ? exams.entries[0].grade : null;
    const deeltoets_2 = (exams && exams.entries.length > 1) ? exams.entries[1].grade : null;
    const deeltoets_3 = (exams && exams.entries.length > 2) ? exams.entries[2].grade : null;

    const perusall: ITile | undefined = tiles.find((tile: ITile) => tile.name === "Perusall Assignments");
    const perusall_1 = (perusall && perusall.entries.length > 0) ? perusall.entries[0].grade : null;
    const perusall_2 = (perusall && perusall.entries.length > 1) ? perusall.entries[1].grade : null;
    const perusall_3 = (perusall && perusall.entries.length > 2) ? perusall.entries[2].grade : null;

    const practice_sessions: ITile | undefined = tiles.find((tile: ITile) => tile.name === "Practice Sessions");
    const oefentoets_1 = (practice_sessions && practice_sessions.entries.length > 0) ?
      practice_sessions.entries[0].grade : null;
    const oefentoets_2 = (practice_sessions && practice_sessions.entries.length > 1) ?
      practice_sessions.entries[1].grade : null;

    const quizzes: ITile | undefined = tiles.find((tile: ITile) => tile.name === "Quizzes");
    const quiz_1 = (quizzes && quizzes.entries.length > 0) ? quizzes.entries[0].grade : null;
    const quiz_2 = (quizzes && quizzes.entries.length > 1) ? quizzes.entries[1].grade : null;
    const quiz_3 = (quizzes && quizzes.entries.length > 2) ? quizzes.entries[2].grade : null;
    const quiz_4 = (quizzes && quizzes.entries.length > 3) ? quizzes.entries[3].grade : null;

    return axios.post(
      `http://${window.location.hostname}:8000/`,
      {
        deeltoets_1, deeltoets_2, deeltoets_3,
        perusall_1, perusall_2, perusall_3,
        oefentoets_1, oefentoets_2,
        quiz_1, quiz_2, quiz_3, quiz_4
      }
    );
  }
}
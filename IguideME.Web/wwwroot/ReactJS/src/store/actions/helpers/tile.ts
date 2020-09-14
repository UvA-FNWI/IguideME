import {IBackendResponse} from "../../../models/IBackendResponse";
import {ITile} from "../../../models/ITile";
import {makePeerComparison} from "./peer";
import PredictionController from "../../../api/prediction";

export const constructDiscussionTile = (response: IBackendResponse) => {
  const { data } = response;

  const tile: ITile = {
    type: "activity",
    rank: 5,
    name: "Send in questions",
    visible: true,
    progress: data.length,
    peer_comparison: {
      minimum: 0,
      maximum: data.length,
      average: 2
    },
    entry_view_type: "components",
    entries: data.map((discussion: any) => ({
      name: discussion.title,
      hide_action_button: true,
      grade: null,
      items: [],
      metadata: discussion.message
    }))
  }
  return tile;
}


export const constructQuizzesTile = (response: IBackendResponse) => {
  const { submissions, quizzes, questions, peer_comp } = response.data;

  const answers = (response.data.questions || []).map((x: any) => x.map((y: any) => y.length === 0 ? null : y).flat());

  const tile: ITile = {
    rank: 1,
    type: "activity",
    name: "Quizzes",
    visible: true,
    progress: Math.round((submissions.filter((submission: any) => submission.score !== null).length / quizzes.length) * 100),
    average_grade: submissions.filter((submission: any) => submission.score !== null)
      .map((submission: any) => submission.score).reduce((sum: number, current: number) => sum + current, 0 ) /
      submissions.filter((submission: any) => submission.score !== null).length,
    peer_comparison: makePeerComparison(peer_comp),
    entry_view_type: "components",
    entries: quizzes.map((quiz: any, index: number) => ({
      name: quiz.title,
      grade: submissions[index] ? submissions[index].score : null,
      items: (answers[index] || []).map((x: any, i: number) => ({
          name: `Question #${i + 1}`,
          status: (submissions[index] !== null) ?
            (!x ? "failed" : "passed") :
            "unstarted"
        })
      )
    }))
  }
  return tile;
}

export const constructPerusallTile = (response: IBackendResponse) => {
  const perusall = response.data.payload;
  const keys = Object.keys(perusall);
  const TOTAL_PERUSALL_ASSIGNMENTS = 3;

  const tile: ITile = {
    rank: 3,
    type: "activity",
    name: "Perusall Assignments",
    visible: true,
    progress: Math.round((keys.length / TOTAL_PERUSALL_ASSIGNMENTS) * 100),
    average_grade: (Math.round((keys.map((key: string) => perusall[key].grade).reduce((sum: number, current: number) => sum + current, 0 ) /
      keys.length) * 10) / 10),
    peer_comparison: makePeerComparison(response.data.peer_comp),
    entry_view_type: "components",
    entries: keys.map((key: string, idx) => {
      return {
        extra_wide: true,
        hide_action_button: true,
        name: `Perusall assignment ${idx + 1}`,
        grade: perusall[key].grade || null,
        items: [],
        metadata: JSON.parse(perusall[key].entry || '{}')
      }
    })
  }
  return tile;
}

export const constructPracticeSessionsTile = (response: IBackendResponse) => {
  const practice_sessions = response.data.payload;
  const keys = Object.keys(practice_sessions);
  const TOTAL_PRACTICE_SESSIONS = 5;

  const tile: ITile = {
    rank: 2,
    type: "activity",
    name: "Practice Sessions",
    visible: true,
    progress: Math.round((keys.length / TOTAL_PRACTICE_SESSIONS) * 100),
    average_grade: Math.round((keys.map((key: string) => practice_sessions[key].grade).reduce((sum: number, current: number) => sum + current, 0 ) /
      keys.length) * 10) / 10,
    peer_comparison: makePeerComparison(response.data.peer_comp),
    entry_view_type: "components",
    entries: keys.map((key: string, idx) => {
      return {
        extra_wide: true,
        hide_action_button: true,
        name: `Practice Session ${idx + 1}`,
        grade: practice_sessions[key].grade,
        items: [],
      }
    })
  }
  return tile;
}

export const constructAttendanceTile = (response: IBackendResponse) => {
  const attendance = response.data.payload;
  const keys = Object.keys(attendance);
  const TOTAL_LESSONS = 25;

  const tile: ITile = {
    rank: 6,
    type: "activity",
    name: "Lecture Attendance",
    visible: true,
    progress: Math.round((attendance.filter((x: any) => x.aanwezig === "ja").length / TOTAL_LESSONS) * 100),
    peer_comparison: makePeerComparison(response.data.peer_comp),
    entry_view_type: "components",
    entries: keys.map((key: string, idx) => {
      return {
        grade: null,
        hide_action_button: true,
        name: `${key}`,
        items: [],
        metadata: {
          'Aanwezig': attendance[key].aanwezig
        }
      }
    })
  }
  return tile;
}

export const constructGradesTile = (response: IBackendResponse) => {
  const grades = response.data.payload;
  const TOTAL_GRADES = 3;

  const tile: ITile = {
    rank: 1,
    type: "grade",
    name: "Exam grades",
    visible: true,
    average_grade: Math.round((grades.map((row: any) => parseFloat(row.grade)).reduce((sum: number, current: number) => sum + current, 0 ) /
      grades.length) * 10) / 10,
    progress: Math.round((grades.length / TOTAL_GRADES) * 100),
    peer_comparison: makePeerComparison(response.data.peer_comp),
    entry_view_type: "components",
    entries: grades.map((row: any) => {
      return {
        grade: row.grade,
        hide_action_button: true,
        name: row.name,
        items: [],
      }
    })
  }
  return tile;
}

export const constructLearningOutcomeTile = (): ITile => {
  return {
    rank: 2,
    type: "outcome",
    name: "Learning Outcome",
    visible: true,
    progress: 0,
    peer_comparison: {
      minimum: 0,
      maximum: 0,
      average: 0
    },
    entry_view_type: "components",
    entries: []
  }
}

export const constructPredictionTile = (response: IBackendResponse): ITile => {
  const {data} = response;

  return {
    rank: 2,
    type: "grade",
    name: "Prediction",
    visible: true,
    average_grade: (data && data.length > 0) ? data[data.length - 1]['y_hat'] : '??',
    progress: null,
    peer_comparison: {
      minimum: 0,
      maximum: 0,
      average: 0
    },
    entry_view_type: "graph",
    entries: [
      {
        name: "Predicted grade",
        grade: 0,
        items: [],
        metadata: data
      }]
  }
}


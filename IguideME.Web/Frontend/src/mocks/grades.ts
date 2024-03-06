import { type Submission, type TileGrades } from "@/types/tile";
import { http, HttpResponse } from "msw";
import { MOCK_QUIZ_SUBMISSIONS } from "./submissions/quizzes";
import { MOCK_PERUSALL_SUBMISSIONS } from "./submissions/perusal";
import { MOCK_ATTENDANCE } from "./submissions/attendance";
import { MOCK_PRACTICE_SESSIONS } from "./submissions/practice-sessions";
import { MOCK_EXAMS } from "./submissions/exams";
// import { MOCK_TILES } from "./tiles";
// import { MOCK_PEER_GROUPS } from "./users";

export const gradeHandlers = [
  http.get("tiles/*/grades/*", ({ params }) => {
    const tid = params[0];
    const uid = params[1];
    const tilegrades = MOCK_TILE_GRADES.find((a) => a.id === uid);
    if (tilegrades === undefined) {
      console.warn("No grades found for user", uid);
      return new HttpResponse(null, { status: 404 });
    }
    const goal = tilegrades.goal;
    const tgrade = tilegrades.tile_grades.find(
      (grades) => grades.tileID.toString() === tid,
    );
    if (tgrade === undefined) {
      console.warn("No grades found for tid", tid);
      return new HttpResponse(null, { status: 404 });
    }

    const peergrades = MOCK_PEER_GRADES[goal].find(
      (pgrades) => pgrades.tileID.toString() === tid,
    );

    if (peergrades === undefined) {
      console.warn("No peergrades found");
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json<TileGrades>({
      ...peergrades,
      grade: tgrade.grade,
    });
  }),
];

const MOCK_SUBMISSIONS: Submission[] = [
  ...MOCK_QUIZ_SUBMISSIONS,
  ...MOCK_PERUSALL_SUBMISSIONS,
  ...MOCK_ATTENDANCE,
  ...MOCK_PRACTICE_SESSIONS,
  ...MOCK_EXAMS,
];

const MOCK_TILE_GRADES = [
  {
    id: "28332183",
    goal: 1,
    tile_grades: [
      {
        grade: 77.175,
        tileID: 1,
      },
      {
        grade: 66,
        tileID: 2,
      },
      {
        grade: 87.5,
        tileID: 4,
      },
      {
        grade: 54.75,
        tileID: 5,
      },
      {
        grade: 83.583,
        tileID: 7,
      },
      {
        grade: 71.1,
        tileID: 9,
      },
    ],
  },
  {
    id: "31665008",
    goal: 1,
    tile_grades: [
      {
        grade: 10,
        tileID: 1,
      },
      {
        grade: 33,
        tileID: 2,
      },
      {
        grade: 12.5,
        tileID: 4,
      },
      {
        grade: 62,
        tileID: 5,
      },
      {
        grade: 13.32,
        tileID: 7,
      },
      {
        grade: 40,
        tileID: 9,
      },
    ],
  },
  {
    id: "50326251",
    goal: 1,
    tile_grades: [
      {
        grade: 84.82499999999999,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 62.5,
        tileID: 4,
      },
      {
        grade: 32.5,
        tileID: 5,
      },
      {
        grade: 87.2127,
        tileID: 7,
      },
      {
        grade: 88.1,
        tileID: 9,
      },
    ],
  },
  {
    id: "18298956",
    goal: 1,
    tile_grades: [
      {
        grade: 80.625,
        tileID: 1,
      },
      {
        grade: 66,
        tileID: 2,
      },
      {
        grade: 87.5,
        tileID: 4,
      },
      {
        grade: 91,
        tileID: 5,
      },
      {
        grade: 87.0462,
        tileID: 7,
      },
      {
        grade: 83.3,
        tileID: 9,
      },
    ],
  },
  {
    id: "31665008",
    goal: 3,
    tile_grades: [
      {
        grade: 10,
        tileID: 1,
      },
      {
        grade: 33,
        tileID: 2,
      },
      {
        grade: 12.5,
        tileID: 4,
      },
      {
        grade: 62,
        tileID: 5,
      },
      {
        grade: 13.32,
        tileID: 7,
      },
      {
        grade: 40,
        tileID: 9,
      },
    ],
  },
  {
    id: "50326251",
    goal: 3,
    tile_grades: [
      {
        grade: 84.82499999999999,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 62.5,
        tileID: 4,
      },
      {
        grade: 32.5,
        tileID: 5,
      },
      {
        grade: 87.2127,
        tileID: 7,
      },
      {
        grade: 88.1,
        tileID: 9,
      },
    ],
  },
  {
    id: "18298956",
    goal: 3,
    tile_grades: [
      {
        grade: 80.625,
        tileID: 1,
      },
      {
        grade: 66,
        tileID: 2,
      },
      {
        grade: 87.5,
        tileID: 4,
      },
      {
        grade: 91,
        tileID: 5,
      },
      {
        grade: 87.0462,
        tileID: 7,
      },
      {
        grade: 83.3,
        tileID: 9,
      },
    ],
  },
  {
    id: "35683215",
    goal: 3,
    tile_grades: [
      {
        grade: 59.775000000000006,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 62.5,
        tileID: 4,
      },
      {
        grade: 87.25,
        tileID: 5,
      },
      {
        grade: 62.7372,
        tileID: 7,
      },
      {
        grade: 57.8,
        tileID: 9,
      },
    ],
  },
  {
    id: "74114284",
    goal: 3,
    tile_grades: [
      {
        grade: 83.975,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 62.5,
        tileID: 4,
      },
      {
        grade: 60.5,
        tileID: 5,
      },
      {
        grade: 91.0755,
        tileID: 7,
      },
      {
        grade: 81.1,
        tileID: 9,
      },
    ],
  },
  {
    id: "95372011",
    goal: 3,
    tile_grades: [
      {
        grade: 0,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 100,
        tileID: 4,
      },
      {
        grade: 25,
        tileID: 5,
      },
      {
        grade: 0,
        tileID: 7,
      },
      {
        grade: 0,
        tileID: 9,
      },
    ],
  },
  {
    id: "48470625",
    goal: 3,
    tile_grades: [
      {
        grade: 80.625,
        tileID: 1,
      },
      {
        grade: 33,
        tileID: 2,
      },
      {
        grade: 37.5,
        tileID: 4,
      },
      {
        grade: 67,
        tileID: 5,
      },
      {
        grade: 84.11580000000001,
        tileID: 7,
      },
      {
        grade: 84.4,
        tileID: 9,
      },
    ],
  },
  {
    id: "41393783",
    goal: 3,
    tile_grades: [
      {
        grade: 68.72500000000001,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 87.5,
        tileID: 4,
      },
      {
        grade: 74,
        tileID: 5,
      },
      {
        grade: 72.7938,
        tileID: 7,
      },
      {
        grade: 76.7,
        tileID: 9,
      },
    ],
  },
  {
    id: "38152009",
    goal: 3,
    tile_grades: [
      {
        grade: 70.47500000000001,
        tileID: 1,
      },
      {
        grade: 33,
        tileID: 2,
      },
      {
        grade: 62.5,
        tileID: 4,
      },
      {
        grade: 49,
        tileID: 5,
      },
      {
        grade: 76.1238,
        tileID: 7,
      },
      {
        grade: 67.8,
        tileID: 9,
      },
    ],
  },
  {
    id: "48905367",
    goal: 3,
    tile_grades: [
      {
        grade: 0,
        tileID: 1,
      },
      {
        grade: 33,
        tileID: 2,
      },
      {
        grade: 100,
        tileID: 4,
      },
      {
        grade: 77.25,
        tileID: 5,
      },
      {
        grade: 0,
        tileID: 7,
      },
      {
        grade: 0,
        tileID: 9,
      },
    ],
  },
  {
    id: "50326251",
    goal: 4,
    tile_grades: [
      {
        grade: 84.82499999999999,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 62.5,
        tileID: 4,
      },
      {
        grade: 32.5,
        tileID: 5,
      },
      {
        grade: 87.2127,
        tileID: 7,
      },
      {
        grade: 88.1,
        tileID: 9,
      },
    ],
  },
  {
    id: "18298956",
    goal: 4,
    tile_grades: [
      {
        grade: 80.625,
        tileID: 1,
      },
      {
        grade: 66,
        tileID: 2,
      },
      {
        grade: 87.5,
        tileID: 4,
      },
      {
        grade: 91,
        tileID: 5,
      },
      {
        grade: 87.0462,
        tileID: 7,
      },
      {
        grade: 83.3,
        tileID: 9,
      },
    ],
  },
  {
    id: "35683215",
    goal: 4,
    tile_grades: [
      {
        grade: 59.775000000000006,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 62.5,
        tileID: 4,
      },
      {
        grade: 87.25,
        tileID: 5,
      },
      {
        grade: 62.7372,
        tileID: 7,
      },
      {
        grade: 57.8,
        tileID: 9,
      },
    ],
  },
  {
    id: "74114284",
    goal: 4,
    tile_grades: [
      {
        grade: 83.975,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 62.5,
        tileID: 4,
      },
      {
        grade: 60.5,
        tileID: 5,
      },
      {
        grade: 91.0755,
        tileID: 7,
      },
      {
        grade: 81.1,
        tileID: 9,
      },
    ],
  },
  {
    id: "95372011",
    goal: 4,
    tile_grades: [
      {
        grade: 0,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 100,
        tileID: 4,
      },
      {
        grade: 25,
        tileID: 5,
      },
      {
        grade: 0,
        tileID: 7,
      },
      {
        grade: 0,
        tileID: 9,
      },
    ],
  },
  {
    id: "48470625",
    goal: 4,
    tile_grades: [
      {
        grade: 80.625,
        tileID: 1,
      },
      {
        grade: 33,
        tileID: 2,
      },
      {
        grade: 37.5,
        tileID: 4,
      },
      {
        grade: 67,
        tileID: 5,
      },
      {
        grade: 84.11580000000001,
        tileID: 7,
      },
      {
        grade: 84.4,
        tileID: 9,
      },
    ],
  },
  {
    id: "41393783",
    goal: 4,
    tile_grades: [
      {
        grade: 68.72500000000001,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 87.5,
        tileID: 4,
      },
      {
        grade: 74,
        tileID: 5,
      },
      {
        grade: 72.7938,
        tileID: 7,
      },
      {
        grade: 76.7,
        tileID: 9,
      },
    ],
  },
  {
    id: "38152009",
    goal: 4,
    tile_grades: [
      {
        grade: 70.47500000000001,
        tileID: 1,
      },
      {
        grade: 33,
        tileID: 2,
      },
      {
        grade: 62.5,
        tileID: 4,
      },
      {
        grade: 49,
        tileID: 5,
      },
      {
        grade: 76.1238,
        tileID: 7,
      },
      {
        grade: 67.8,
        tileID: 9,
      },
    ],
  },
  {
    id: "48905367",
    goal: 4,
    tile_grades: [
      {
        grade: 0,
        tileID: 1,
      },
      {
        grade: 33,
        tileID: 2,
      },
      {
        grade: 100,
        tileID: 4,
      },
      {
        grade: 77.25,
        tileID: 5,
      },
      {
        grade: 0,
        tileID: 7,
      },
      {
        grade: 0,
        tileID: 9,
      },
    ],
  },
  {
    id: "35683215",
    goal: 5,
    tile_grades: [
      {
        grade: 59.775000000000006,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 62.5,
        tileID: 4,
      },
      {
        grade: 87.25,
        tileID: 5,
      },
      {
        grade: 62.7372,
        tileID: 7,
      },
      {
        grade: 57.8,
        tileID: 9,
      },
    ],
  },
  {
    id: "74114284",
    goal: 5,
    tile_grades: [
      {
        grade: 83.975,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 62.5,
        tileID: 4,
      },
      {
        grade: 60.5,
        tileID: 5,
      },
      {
        grade: 91.0755,
        tileID: 7,
      },
      {
        grade: 81.1,
        tileID: 9,
      },
    ],
  },
  {
    id: "95372011",
    goal: 5,
    tile_grades: [
      {
        grade: 0,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 100,
        tileID: 4,
      },
      {
        grade: 25,
        tileID: 5,
      },
      {
        grade: 0,
        tileID: 7,
      },
      {
        grade: 0,
        tileID: 9,
      },
    ],
  },
  {
    id: "48470625",
    goal: 5,
    tile_grades: [
      {
        grade: 80.625,
        tileID: 1,
      },
      {
        grade: 33,
        tileID: 2,
      },
      {
        grade: 37.5,
        tileID: 4,
      },
      {
        grade: 67,
        tileID: 5,
      },
      {
        grade: 84.11580000000001,
        tileID: 7,
      },
      {
        grade: 84.4,
        tileID: 9,
      },
    ],
  },
  {
    id: "41393783",
    goal: 5,
    tile_grades: [
      {
        grade: 68.72500000000001,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 87.5,
        tileID: 4,
      },
      {
        grade: 74,
        tileID: 5,
      },
      {
        grade: 72.7938,
        tileID: 7,
      },
      {
        grade: 76.7,
        tileID: 9,
      },
    ],
  },
  {
    id: "38152009",
    goal: 5,
    tile_grades: [
      {
        grade: 70.47500000000001,
        tileID: 1,
      },
      {
        grade: 33,
        tileID: 2,
      },
      {
        grade: 62.5,
        tileID: 4,
      },
      {
        grade: 49,
        tileID: 5,
      },
      {
        grade: 76.1238,
        tileID: 7,
      },
      {
        grade: 67.8,
        tileID: 9,
      },
    ],
  },
  {
    id: "48905367",
    goal: 5,
    tile_grades: [
      {
        grade: 0,
        tileID: 1,
      },
      {
        grade: 33,
        tileID: 2,
      },
      {
        grade: 100,
        tileID: 4,
      },
      {
        grade: 77.25,
        tileID: 5,
      },
      {
        grade: 0,
        tileID: 7,
      },
      {
        grade: 0,
        tileID: 9,
      },
    ],
  },
  {
    id: "59540503",
    goal: 6,
    tile_grades: [
      {
        grade: 64.475,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 87.5,
        tileID: 4,
      },
      {
        grade: 87.25,
        tileID: 5,
      },
      {
        grade: 72.7272,
        tileID: 7,
      },
      {
        grade: 73.3,
        tileID: 9,
      },
    ],
  },
  {
    id: "45476233",
    goal: 6,
    tile_grades: [
      {
        grade: 52.449999999999996,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 87.5,
        tileID: 4,
      },
      {
        grade: 92,
        tileID: 5,
      },
      {
        grade: 59.3406,
        tileID: 7,
      },
      {
        grade: 58.9,
        tileID: 9,
      },
    ],
  },
  {
    id: "29376337",
    goal: 6,
    tile_grades: [
      {
        grade: 67.75,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 100,
        tileID: 4,
      },
      {
        grade: 54.75,
        tileID: 5,
      },
      {
        grade: 74.95830000000001,
        tileID: 7,
      },
      {
        grade: 100,
        tileID: 9,
      },
    ],
  },
  {
    id: "27034712",
    goal: 6,
    tile_grades: [
      {
        grade: 73.925,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 62.5,
        tileID: 4,
      },
      {
        grade: 32.5,
        tileID: 5,
      },
      {
        grade: 75.89070000000001,
        tileID: 7,
      },
      {
        grade: 85,
        tileID: 9,
      },
    ],
  },
  {
    id: "90434281",
    goal: 6,
    tile_grades: [
      {
        grade: 54.175000000000004,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 100,
        tileID: 4,
      },
      {
        grade: 88.25,
        tileID: 5,
      },
      {
        grade: 57.3426,
        tileID: 7,
      },
      {
        grade: 58.3,
        tileID: 9,
      },
    ],
  },
  {
    id: "22976781",
    goal: 6,
    tile_grades: [
      {
        grade: 74.05,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 75,
        tileID: 4,
      },
      {
        grade: 70,
        tileID: 5,
      },
      {
        grade: 78.38820000000001,
        tileID: 7,
      },
      {
        grade: 92.5,
        tileID: 9,
      },
    ],
  },
  {
    id: "35251913",
    goal: 6,
    tile_grades: [
      {
        grade: 27.875,
        tileID: 1,
      },
      {
        grade: 33,
        tileID: 2,
      },
      {
        grade: 37.5,
        tileID: 4,
      },
      {
        grade: 42.75,
        tileID: 5,
      },
      {
        grade: 21.4119,
        tileID: 7,
      },
      {
        grade: 0,
        tileID: 9,
      },
    ],
  },
  {
    id: "28624178",
    goal: 6,
    tile_grades: [
      {
        grade: 37.825,
        tileID: 1,
      },
      {
        grade: 0,
        tileID: 2,
      },
      {
        grade: 25,
        tileID: 4,
      },
      {
        grade: 32.5,
        tileID: 5,
      },
      {
        grade: 50.3829,
        tileID: 7,
      },
      {
        grade: 71.7,
        tileID: 9,
      },
    ],
  },
  {
    id: "76262947",
    goal: 6,
    tile_grades: [
      {
        grade: 74.2,
        tileID: 1,
      },
      {
        grade: 33,
        tileID: 2,
      },
      {
        grade: 25,
        tileID: 4,
      },
      {
        grade: 78.5,
        tileID: 5,
      },
      {
        grade: 79.92,
        tileID: 7,
      },
      {
        grade: 87.5,
        tileID: 9,
      },
    ],
  },
  {
    id: "41803722",
    goal: 6,
    tile_grades: [
      {
        grade: 83.9,
        tileID: 1,
      },
      {
        grade: 66,
        tileID: 2,
      },
      {
        grade: 50,
        tileID: 4,
      },
      {
        grade: 83.5,
        tileID: 5,
      },
      {
        grade: 86.6466,
        tileID: 7,
      },
      {
        grade: 90,
        tileID: 9,
      },
    ],
  },
  {
    id: "41149744",
    goal: 7,
    tile_grades: [
      {
        grade: 0,
        tileID: 1,
      },
      {
        grade: 0,
        tileID: 2,
      },
      {
        grade: 25,
        tileID: 4,
      },
      {
        grade: 32.5,
        tileID: 5,
      },
      {
        grade: 0,
        tileID: 7,
      },
      {
        grade: 0,
        tileID: 9,
      },
    ],
  },
  {
    id: "16967126",
    goal: 7,
    tile_grades: [
      {
        grade: 84.07499999999999,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 100,
        tileID: 4,
      },
      {
        grade: 71,
        tileID: 5,
      },
      {
        grade: 86.6466,
        tileID: 7,
      },
      {
        grade: 90,
        tileID: 9,
      },
    ],
  },
  {
    id: "41898388",
    goal: 7,
    tile_grades: [
      {
        grade: 79.15,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 87.5,
        tileID: 4,
      },
      {
        grade: 53.75,
        tileID: 5,
      },
      {
        grade: 83.8494,
        tileID: 7,
      },
      {
        grade: 73.3,
        tileID: 9,
      },
    ],
  },
  {
    id: "23400528",
    goal: 7,
    tile_grades: [
      {
        grade: 57.1,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 100,
        tileID: 4,
      },
      {
        grade: 53.25,
        tileID: 5,
      },
      {
        grade: 59.87340000000001,
        tileID: 7,
      },
      {
        grade: 64.4,
        tileID: 9,
      },
    ],
  },
  {
    id: "20936679",
    goal: 7,
    tile_grades: [
      {
        grade: 57.525,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 50,
        tileID: 4,
      },
      {
        grade: 70.25,
        tileID: 5,
      },
      {
        grade: 76.6233,
        tileID: 7,
      },
      {
        grade: 78.3,
        tileID: 9,
      },
    ],
  },
  {
    id: "81005245",
    goal: 7,
    tile_grades: [
      {
        grade: 0,
        tileID: 1,
      },
      {
        grade: 66,
        tileID: 2,
      },
      {
        grade: 75,
        tileID: 4,
      },
      {
        grade: 74.75,
        tileID: 5,
      },
      {
        grade: 0,
        tileID: 7,
      },
      {
        grade: 0,
        tileID: 9,
      },
    ],
  },
  {
    id: "42345728",
    goal: 7,
    tile_grades: [
      {
        grade: 88.05000000000001,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 100,
        tileID: 4,
      },
      {
        grade: 53,
        tileID: 5,
      },
      {
        grade: 90.0099,
        tileID: 7,
      },
      {
        grade: 81.1,
        tileID: 9,
      },
    ],
  },
  {
    id: "43754947",
    goal: 7,
    tile_grades: [
      {
        grade: 0,
        tileID: 1,
      },
      {
        grade: 33,
        tileID: 2,
      },
      {
        grade: 50,
        tileID: 4,
      },
      {
        grade: 85,
        tileID: 5,
      },
      {
        grade: 0,
        tileID: 7,
      },
      {
        grade: 0,
        tileID: 9,
      },
    ],
  },
  {
    id: "55571292",
    goal: 7,
    tile_grades: [
      {
        grade: 62.55,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 62.5,
        tileID: 4,
      },
      {
        grade: 48.75,
        tileID: 5,
      },
      {
        grade: 69.06420000000001,
        tileID: 7,
      },
      {
        grade: 68.9,
        tileID: 9,
      },
    ],
  },
  {
    id: "54264654",
    goal: 8,
    tile_grades: [
      {
        grade: 63.975,
        tileID: 1,
      },
      {
        grade: 66,
        tileID: 2,
      },
      {
        grade: 87.5,
        tileID: 4,
      },
      {
        grade: 49.75,
        tileID: 5,
      },
      {
        grade: 85.21470000000001,
        tileID: 7,
      },
      {
        grade: 82.5,
        tileID: 9,
      },
    ],
  },
  {
    id: "24585559",
    goal: 8,
    tile_grades: [
      {
        grade: 66.325,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 87.5,
        tileID: 4,
      },
      {
        grade: 80,
        tileID: 5,
      },
      {
        grade: 72.5607,
        tileID: 7,
      },
      {
        grade: 61.4,
        tileID: 9,
      },
    ],
  },
  {
    id: "23744275",
    goal: 8,
    tile_grades: [
      {
        grade: 97.5,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 75,
        tileID: 4,
      },
      {
        grade: 32.5,
        tileID: 5,
      },
      {
        grade: 99.3006,
        tileID: 7,
      },
      {
        grade: 100,
        tileID: 9,
      },
    ],
  },
  {
    id: "43219917",
    goal: 8,
    tile_grades: [
      {
        grade: 66.5,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 62.5,
        tileID: 4,
      },
      {
        grade: 88,
        tileID: 5,
      },
      {
        grade: 73.06020000000001,
        tileID: 7,
      },
      {
        grade: 83.3,
        tileID: 9,
      },
    ],
  },
  {
    id: "74886921",
    goal: 8,
    tile_grades: [
      {
        grade: 79.925,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 50,
        tileID: 4,
      },
      {
        grade: 66.75,
        tileID: 5,
      },
      {
        grade: 89.5104,
        tileID: 7,
      },
      {
        grade: 80.6,
        tileID: 9,
      },
    ],
  },
  {
    id: "81888190",
    goal: 8,
    tile_grades: [
      {
        grade: 77.675,
        tileID: 1,
      },
      {
        grade: 66,
        tileID: 2,
      },
      {
        grade: 75,
        tileID: 4,
      },
      {
        grade: 32.5,
        tileID: 5,
      },
      {
        grade: 78.72120000000001,
        tileID: 7,
      },
      {
        grade: 82.8,
        tileID: 9,
      },
    ],
  },
  {
    id: "27817769",
    goal: 8,
    tile_grades: [
      {
        grade: 22.225,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 75,
        tileID: 4,
      },
      {
        grade: 80,
        tileID: 5,
      },
      {
        grade: 29.603700000000003,
        tileID: 7,
      },
      {
        grade: 88.9,
        tileID: 9,
      },
    ],
  },
  {
    id: "21276717",
    goal: 8,
    tile_grades: [
      {
        grade: 0,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 100,
        tileID: 4,
      },
      {
        grade: 32.5,
        tileID: 5,
      },
      {
        grade: 0,
        tileID: 7,
      },
      {
        grade: 0,
        tileID: 9,
      },
    ],
  },
  {
    id: "46666218",
    goal: 9,
    tile_grades: [
      {
        grade: 65.15,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 75,
        tileID: 4,
      },
      {
        grade: 83.5,
        tileID: 5,
      },
      {
        grade: 73.22670000000001,
        tileID: 7,
      },
      {
        grade: 64.4,
        tileID: 9,
      },
    ],
  },
  {
    id: "96600883",
    goal: 9,
    tile_grades: [
      {
        grade: 71.3,
        tileID: 1,
      },
      {
        grade: 33,
        tileID: 2,
      },
      {
        grade: 100,
        tileID: 4,
      },
      {
        grade: 77.25,
        tileID: 5,
      },
      {
        grade: 72.3942,
        tileID: 7,
      },
      {
        grade: 60,
        tileID: 9,
      },
    ],
  },
  {
    id: "53036575",
    goal: 9,
    tile_grades: [
      {
        grade: 84.07499999999999,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 100,
        tileID: 4,
      },
      {
        grade: 32.5,
        tileID: 5,
      },
      {
        grade: 86.6466,
        tileID: 7,
      },
      {
        grade: 90,
        tileID: 9,
      },
    ],
  },
  {
    id: "55249485",
    goal: 9,
    tile_grades: [
      {
        grade: 72.05,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 75,
        tileID: 4,
      },
      {
        grade: 82,
        tileID: 5,
      },
      {
        grade: 76.1238,
        tileID: 7,
      },
      {
        grade: 78.9,
        tileID: 9,
      },
    ],
  },
  {
    id: "46647543",
    goal: 9,
    tile_grades: [
      {
        grade: 17.225,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 87.5,
        tileID: 4,
      },
      {
        grade: 83.25,
        tileID: 5,
      },
      {
        grade: 22.943700000000003,
        tileID: 7,
      },
      {
        grade: 68.9,
        tileID: 9,
      },
    ],
  },
  {
    id: "70805720",
    goal: 9,
    tile_grades: [
      {
        grade: 82.875,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 100,
        tileID: 4,
      },
      {
        grade: 74.25,
        tileID: 5,
      },
      {
        grade: 88.14510000000001,
        tileID: 7,
      },
      {
        grade: 80,
        tileID: 9,
      },
    ],
  },
  {
    id: "77161172",
    goal: 9,
    tile_grades: [
      {
        grade: 89.125,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 62.5,
        tileID: 4,
      },
      {
        grade: 70.5,
        tileID: 5,
      },
      {
        grade: 90.07650000000001,
        tileID: 7,
      },
      {
        grade: 90,
        tileID: 9,
      },
    ],
  },
  {
    id: "97222205",
    goal: 9,
    tile_grades: [
      {
        grade: 16.775,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 75,
        tileID: 4,
      },
      {
        grade: 40.25,
        tileID: 5,
      },
      {
        grade: 22.3443,
        tileID: 7,
      },
      {
        grade: 0,
        tileID: 9,
      },
    ],
  },
  {
    id: "20380320",
    goal: 9,
    tile_grades: [
      {
        grade: 0,
        tileID: 1,
      },
      {
        grade: 66,
        tileID: 2,
      },
      {
        grade: 62.5,
        tileID: 4,
      },
      {
        grade: 84,
        tileID: 5,
      },
      {
        grade: 0,
        tileID: 7,
      },
      {
        grade: 0,
        tileID: 9,
      },
    ],
  },
  {
    id: "96955357",
    goal: 9,
    tile_grades: [
      {
        grade: 37.675,
        tileID: 1,
      },
      {
        grade: 66,
        tileID: 2,
      },
      {
        grade: 62.5,
        tileID: 4,
      },
      {
        grade: 75.25,
        tileID: 5,
      },
      {
        grade: 50.183099999999996,
        tileID: 7,
      },
      {
        grade: 73.6,
        tileID: 9,
      },
    ],
  },
  {
    id: "95366984",
    goal: 10,
    tile_grades: [
      {
        grade: 0,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 75,
        tileID: 4,
      },
      {
        grade: 59.75,
        tileID: 5,
      },
      {
        grade: 0,
        tileID: 7,
      },
      {
        grade: 0,
        tileID: 9,
      },
    ],
  },
  {
    id: "45844627",
    goal: 10,
    tile_grades: [
      {
        grade: 70.1,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 100,
        tileID: 4,
      },
      {
        grade: 32.5,
        tileID: 5,
      },
      {
        grade: 93.3732,
        tileID: 7,
      },
      {
        grade: 82.2,
        tileID: 9,
      },
    ],
  },
  {
    id: "32324131",
    goal: 10,
    tile_grades: [
      {
        grade: 84.325,
        tileID: 1,
      },
      {
        grade: 33,
        tileID: 2,
      },
      {
        grade: 25,
        tileID: 4,
      },
      {
        grade: 73,
        tileID: 5,
      },
      {
        grade: 95.904,
        tileID: 7,
      },
      {
        grade: 97.8,
        tileID: 9,
      },
    ],
  },
  {
    id: "66889858",
    goal: 10,
    tile_grades: [
      {
        grade: 38.55,
        tileID: 1,
      },
      {
        grade: 99,
        tileID: 2,
      },
      {
        grade: 75,
        tileID: 4,
      },
      {
        grade: 54.5,
        tileID: 5,
      },
      {
        grade: 51.3486,
        tileID: 7,
      },
      {
        grade: 85.6,
        tileID: 9,
      },
    ],
  },
  {
    id: "86899376",
    goal: 10,
    tile_grades: [
      {
        grade: 58.025000000000006,
        tileID: 1,
      },
      {
        grade: 66,
        tileID: 2,
      },
      {
        grade: 75,
        tileID: 4,
      },
      {
        grade: 32.5,
        tileID: 5,
      },
      {
        grade: 56.4102,
        tileID: 7,
      },
      {
        grade: 66.7,
        tileID: 9,
      },
    ],
  },
];
// for (let goal = 1; goal <= 10; goal++) {
//   const peerGroup = MOCK_PEER_GROUPS[goal];
//   if (peerGroup.length === 0) {
//     MOCK_TILE_GRADES.push([]);
//     continue;
//   }

//   const peerAssignmentDict = new Map<number, number[]>();
//   const peerTileDict = new Map<number, number[]>();
//   const peerTotalAvg: number[] = [];

//   peerGroup.forEach((user) => {
//     const userAssignmentGrades = new Map<number, number>();
//     MOCK_SUBMISSIONS.filter((sub) => sub.userID === user.userID).forEach(
//       (sub) => {
//         userAssignmentGrades.set(sub.assignmentID, sub.grade);
//       },
//     );
//     let userTotal = 0;

//     MOCK_TILES.filter((tile) => ![3, 6, 10].includes(tile.id)).forEach(
//       (tile) => {
//         let userTileGrade = 0;

//         // We get the user's submissions one by one (if they exists in their gradelist)
//         tile.entries.forEach((entry) => {
//           const singleEntryGrade =
//             userAssignmentGrades.get(entry.content_id) !== undefined
//               ? userAssignmentGrades.get(entry.content_id)!
//               : 0;

//           // and by summing them (multiplying by weight) we get the total of the user's Tile Grade
//           userTileGrade += singleEntryGrade * entry.weight;

//           // Also, we store the grade of each submission to a List of the Assignment Dictionary, accross all users of the same peergroup
//           if (peerAssignmentDict.get(entry.content_id) === undefined)
//             peerAssignmentDict.set(entry.content_id, []);
//           peerAssignmentDict.get(entry.content_id)!.push(singleEntryGrade);
//         });
//         // After we're done with all entries of that tile, we register the Tile Grade for this peer
//         // console.log("peer", { peerID, tid: tile.id, userTileGrade });

//         // And then we add this to the Tile Dictionary (again accross peers)
//         if (peerTileDict.get(tile.id) === undefined)
//           peerTileDict.set(tile.id, []);
//         peerTileDict.get(tile.id)!.push(userTileGrade);

//         // FInaly we add to the user's total grade
//         userTotal += userTileGrade * tile.weight;
//       },
//     );

//     // For consistency with the goal and predicted grade display we divide it by 10.
//     userTotal /= 10;

//     // Store the user's Total grade and add this to the list of all grades across the peergroup (peerTotalAvg)
//     // console.log("usertotal", userTotal);
//     peerTotalAvg.push(userTotal);
//   });

//   // console.log("peerAssignmentDict", peerAssignmentDict);
//   // console.log("peerTileDict", peerTileDict);
//   console.log("goal", goal);
//   // console.log(
//   // "tilegrades",
//   MOCK_TILE_GRADES.push(
//     peerGroup.map((user, index) => {
//       return {
//         id: user.userID,
//         tile_grades: MOCK_TILES.filter(
//           (tile) => ![3, 6, 10].includes(tile.id),
//         ).map((tile) => {
//           const grades = peerTileDict.get(tile.id)!;
//           const grade = grades[index];
//           return {
//             grade,
//             tileID: tile.id,
//           };
//         }),
//       };
//     }),
//   );
//   // );
//   // console.log(
//   //   "peergrades",
//   //   MOCK_TILES.filter((tile) => ![3, 6, 10].includes(tile.id)).map((tile) => {
//   //     const grades = peerTileDict.get(tile.id)!;
//   //     const peerAvg = grades.reduce((a, b) => a + b, 0) / grades.length;
//   //     const peerMin = Math.min(...grades);
//   //     const peerMax = Math.max(...grades);
//   //     return {
//   //       peerAvg,
//   //       peerMin,
//   //       peerMax,
//   //       tileID: tile.id,
//   //     };
//   //   }),
//   // );
//   // console.log("peerTotalAvg", peerTotalAvg);
// }

const MOCK_PEER_GRADES = [
  // goal grade 0:
  [],
  // goal grade 1:
  [
    {
      peerAvg: 63.15625,
      peerMin: 10,
      peerMax: 84.82499999999999,
      tileID: 1,
    },
    {
      peerAvg: 66,
      peerMin: 33,
      peerMax: 99,
      tileID: 2,
    },
    {
      peerAvg: 62.5,
      peerMin: 12.5,
      peerMax: 87.5,
      tileID: 4,
    },
    {
      peerAvg: 60.0625,
      peerMin: 32.5,
      peerMax: 91,
      tileID: 5,
    },
    {
      peerAvg: 67.790475,
      peerMin: 13.32,
      peerMax: 87.2127,
      tileID: 7,
    },
    {
      peerAvg: 70.625,
      peerMin: 40,
      peerMax: 88.1,
      tileID: 9,
    },
  ],
  // goal grade 2:
  [],
  // goal grade 3:
  [
    {
      peerAvg: 53.902499999999996,
      peerMin: 0,
      peerMax: 84.82499999999999,
      tileID: 1,
    },
    {
      peerAvg: 69.3,
      peerMin: 33,
      peerMax: 99,
      tileID: 2,
    },
    {
      peerAvg: 67.5,
      peerMin: 12.5,
      peerMax: 100,
      tileID: 4,
    },
    {
      peerAvg: 62.55,
      peerMin: 25,
      peerMax: 91,
      tileID: 5,
    },
    {
      peerAvg: 57.44250000000001,
      peerMin: 0,
      peerMax: 91.0755,
      tileID: 7,
    },
    {
      peerAvg: 57.919999999999995,
      peerMin: 0,
      peerMax: 88.1,
      tileID: 9,
    },
  ],
  // goal grade 4:
  [
    {
      peerAvg: 58.78055555555555,
      peerMin: 0,
      peerMax: 84.82499999999999,
      tileID: 1,
    },
    {
      peerAvg: 73.33333333333333,
      peerMin: 33,
      peerMax: 99,
      tileID: 2,
    },
    {
      peerAvg: 73.61111111111111,
      peerMin: 37.5,
      peerMax: 100,
      tileID: 4,
    },
    {
      peerAvg: 62.611111111111114,
      peerMin: 25,
      peerMax: 91,
      tileID: 5,
    },
    {
      peerAvg: 62.345,
      peerMin: 0,
      peerMax: 91.0755,
      tileID: 7,
    },
    {
      peerAvg: 59.911111111111104,
      peerMin: 0,
      peerMax: 88.1,
      tileID: 9,
    },
  ],

  // goal grade 5:

  [
    {
      peerAvg: 51.939285714285724,
      peerMin: 0,
      peerMax: 83.975,
      tileID: 1,
    },
    {
      peerAvg: 70.71428571428571,
      peerMin: 33,
      peerMax: 99,
      tileID: 2,
    },
    {
      peerAvg: 73.21428571428571,
      peerMin: 37.5,
      peerMax: 100,
      tileID: 4,
    },
    {
      peerAvg: 62.857142857142854,
      peerMin: 25,
      peerMax: 87.25,
      tileID: 5,
    },
    {
      peerAvg: 55.26372857142858,
      peerMin: 0,
      peerMax: 91.0755,
      tileID: 7,
    },
    {
      peerAvg: 52.542857142857144,
      peerMin: 0,
      peerMax: 84.4,
      tileID: 9,
    },
  ],

  // goal grade 6:

  [
    {
      peerAvg: 61.0625,
      peerMin: 27.875,
      peerMax: 83.9,
      tileID: 1,
    },
    {
      peerAvg: 72.6,
      peerMin: 0,
      peerMax: 99,
      tileID: 2,
    },
    {
      peerAvg: 65,
      peerMin: 25,
      peerMax: 100,
      tileID: 4,
    },
    {
      peerAvg: 66.2,
      peerMin: 32.5,
      peerMax: 92,
      tileID: 5,
    },
    {
      peerAvg: 65.7009,
      peerMin: 21.4119,
      peerMax: 86.6466,
      tileID: 7,
    },
    {
      peerAvg: 71.72,
      peerMin: 0,
      peerMax: 100,
      tileID: 9,
    },
  ],
  // goal grade 7:
  [
    {
      peerAvg: 47.605555555555554,
      peerMin: 0,
      peerMax: 88.05000000000001,
      tileID: 1,
    },
    {
      peerAvg: 77,
      peerMin: 0,
      peerMax: 99,
      tileID: 2,
    },
    {
      peerAvg: 72.22222222222223,
      peerMin: 25,
      peerMax: 100,
      tileID: 4,
    },
    {
      peerAvg: 60.25,
      peerMin: 32.5,
      peerMax: 85,
      tileID: 5,
    },
    {
      peerAvg: 51.7852,
      peerMin: 0,
      peerMax: 90.0099,
      tileID: 7,
    },
    {
      peerAvg: 50.666666666666664,
      peerMin: 0,
      peerMax: 90,
      tileID: 9,
    },
  ],

  // goal grade 8:
  [
    {
      peerAvg: 59.26562500000001,
      peerMin: 0,
      peerMax: 97.5,
      tileID: 1,
    },
    {
      peerAvg: 90.75,
      peerMin: 66,
      peerMax: 99,
      tileID: 2,
    },
    {
      peerAvg: 76.5625,
      peerMin: 50,
      peerMax: 100,
      tileID: 4,
    },
    {
      peerAvg: 57.75,
      peerMin: 32.5,
      peerMax: 88,
      tileID: 5,
    },
    {
      peerAvg: 65.99643750000001,
      peerMin: 0,
      peerMax: 99.3006,
      tileID: 7,
    },
    {
      peerAvg: 72.4375,
      peerMin: 0,
      peerMax: 100,
      tileID: 9,
    },
  ],

  // goal grade 9:

  [
    {
      peerAvg: 53.625,
      peerMin: 0,
      peerMax: 89.125,
      tileID: 1,
    },
    {
      peerAvg: 85.8,
      peerMin: 33,
      peerMax: 99,
      tileID: 2,
    },
    {
      peerAvg: 80,
      peerMin: 62.5,
      peerMax: 100,
      tileID: 4,
    },
    {
      peerAvg: 70.275,
      peerMin: 32.5,
      peerMax: 84,
      tileID: 5,
    },
    {
      peerAvg: 58.2084,
      peerMin: 0,
      peerMax: 90.07650000000001,
      tileID: 7,
    },
    {
      peerAvg: 60.580000000000005,
      peerMin: 0,
      peerMax: 90,
      tileID: 9,
    },
  ],

  // goal grade 10:

  [
    {
      peerAvg: 50.2,
      peerMin: 0,
      peerMax: 84.325,
      tileID: 1,
    },
    {
      peerAvg: 79.2,
      peerMin: 33,
      peerMax: 99,
      tileID: 2,
    },
    {
      peerAvg: 70,
      peerMin: 25,
      peerMax: 100,
      tileID: 4,
    },
    {
      peerAvg: 50.45,
      peerMin: 32.5,
      peerMax: 73,
      tileID: 5,
    },
    {
      peerAvg: 59.4072,
      peerMin: 0,
      peerMax: 95.904,
      tileID: 7,
    },
    {
      peerAvg: 66.46000000000001,
      peerMin: 0,
      peerMax: 97.8,
      tileID: 9,
    },
  ],
];

console.log(MOCK_TILE_GRADES);

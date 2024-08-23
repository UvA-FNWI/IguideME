import { MOCK_ATTENDANCE } from '@/mocks/submission/attendance-example-data';
import { MOCK_EXAMS } from '@/mocks/submission/exam-example-data';
import { MOCK_PERUSALL_SUBMISSIONS } from '@/mocks/submission/perusal-example-data';
import { MOCK_PRACTICE_SESSIONS } from '@/mocks/submission/practice-session-example-data';
import { MOCK_QUIZ_SUBMISSIONS } from '@/mocks/submission/quiz-example-data';
import type { Submission } from '@/types/tile';

const MOCK_SUBMISSIONS: Submission[] = [
  ...MOCK_QUIZ_SUBMISSIONS,
  ...MOCK_PERUSALL_SUBMISSIONS,
  ...MOCK_ATTENDANCE,
  ...MOCK_PRACTICE_SESSIONS,
  ...MOCK_EXAMS,
];

const MOCK_PEER_TILE_GRADES: {
  peerAvg: number;
  peerMin: number;
  peerMax: number;
  tileID: number;
}[][] = [
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
      peerAvg: 67.790475,
      peerMin: 13.32,
      peerMax: 87.2127,
      tileID: 8,
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
      peerAvg: 57.44250000000001,
      peerMin: 0,
      peerMax: 91.0755,
      tileID: 8,
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
      peerAvg: 62.345,
      peerMin: 0,
      peerMax: 91.0755,
      tileID: 8,
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
      peerAvg: 55.26372857142858,
      peerMin: 0,
      peerMax: 91.0755,
      tileID: 8,
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
      peerAvg: 65.7009,
      peerMin: 21.4119,
      peerMax: 86.6466,
      tileID: 8,
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
      peerAvg: 51.7852,
      peerMin: 0,
      peerMax: 90.0099,
      tileID: 8,
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
      peerAvg: 65.99643750000001,
      peerMin: 0,
      peerMax: 99.3006,
      tileID: 8,
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
      peerAvg: 58.2084,
      peerMin: 0,
      peerMax: 90.07650000000001,
      tileID: 8,
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
      peerAvg: 59.4072,
      peerMin: 0,
      peerMax: 95.904,
      tileID: 8,
    },
    {
      peerAvg: 66.46000000000001,
      peerMin: 0,
      peerMax: 97.8,
      tileID: 9,
    },
  ],
];

const MOCK_TILE_GRADES: {
  userID: string;
  tile_grades: { grade: number; tile_id: number; max: number }[];
}[] = [
  {
    userID: '28332183',
    tile_grades: [
      {
        grade: 77.175,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 77.175,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 66,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 87.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 54.75,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 83.583,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 71.1,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '31665008',
    tile_grades: [
      {
        grade: 10,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 10,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 33,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 12.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 62,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 13.32,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 40,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '50326251',
    tile_grades: [
      {
        grade: 84.82499999999999,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 84.82499999999999,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 62.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 32.5,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 87.2127,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 88.1,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '18298956',
    tile_grades: [
      {
        grade: 80.625,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 80.625,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 66,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 87.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 91,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 87.0462,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 83.3,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '31665008',
    tile_grades: [
      {
        grade: 10,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 10,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 33,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 12.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 62,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 13.32,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 40,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '50326251',
    tile_grades: [
      {
        grade: 84.82499999999999,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 84.82499999999999,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 62.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 32.5,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 87.2127,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 88.1,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '18298956',
    tile_grades: [
      {
        grade: 80.625,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 80.625,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 66,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 87.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 91,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 87.0462,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 83.3,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '35683215',
    tile_grades: [
      {
        grade: 59.775000000000006,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 59.775000000000006,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 62.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 87.25,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 62.7372,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 57.8,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '74114284',
    tile_grades: [
      {
        grade: 83.975,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 83.975,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 62.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 60.5,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 91.0755,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 81.1,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '95372011',
    tile_grades: [
      {
        grade: 0,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 0,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 100,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 25,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 0,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 0,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '48470625',
    tile_grades: [
      {
        grade: 80.625,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 80.625,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 33,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 37.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 67,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 84.11580000000001,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 84.4,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '41393783',
    tile_grades: [
      {
        grade: 68.72500000000001,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 68.72500000000001,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 87.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 74,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 72.7938,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 76.7,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '38152009',
    tile_grades: [
      {
        grade: 70.47500000000001,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 70.47500000000001,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 33,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 62.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 49,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 76.1238,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 67.8,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '48905367',
    tile_grades: [
      {
        grade: 0,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 0,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 33,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 100,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 77.25,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 0,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 0,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '50326251',
    tile_grades: [
      {
        grade: 84.82499999999999,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 84.82499999999999,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 62.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 32.5,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 87.2127,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 88.1,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '18298956',
    tile_grades: [
      {
        grade: 80.625,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 80.625,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 66,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 87.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 91,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 87.0462,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 83.3,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '35683215',
    tile_grades: [
      {
        grade: 59.775000000000006,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 59.775000000000006,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 62.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 87.25,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 62.7372,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 57.8,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '74114284',
    tile_grades: [
      {
        grade: 83.975,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 83.975,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 62.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 60.5,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 91.0755,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 81.1,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '95372011',
    tile_grades: [
      {
        grade: 0,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 0,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 100,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 25,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 0,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 0,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '48470625',
    tile_grades: [
      {
        grade: 80.625,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 80.625,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 33,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 37.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 67,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 84.11580000000001,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 84.4,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '41393783',
    tile_grades: [
      {
        grade: 68.72500000000001,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 68.72500000000001,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 87.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 74,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 72.7938,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 76.7,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '38152009',
    tile_grades: [
      {
        grade: 70.47500000000001,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 70.47500000000001,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 33,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 62.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 49,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 76.1238,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 67.8,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '48905367',
    tile_grades: [
      {
        grade: 0,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 0,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 33,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 100,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 77.25,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 0,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 0,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '35683215',
    tile_grades: [
      {
        grade: 59.775000000000006,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 59.775000000000006,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 62.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 87.25,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 62.7372,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 57.8,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '74114284',
    tile_grades: [
      {
        grade: 83.975,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 83.975,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 62.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 60.5,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 91.0755,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 81.1,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '95372011',
    tile_grades: [
      {
        grade: 0,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 0,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 100,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 25,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 0,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 0,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '48470625',
    tile_grades: [
      {
        grade: 80.625,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 80.625,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 33,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 37.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 67,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 84.11580000000001,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 84.4,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '41393783',
    tile_grades: [
      {
        grade: 68.72500000000001,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 68.72500000000001,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 87.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 74,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 72.7938,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 76.7,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '38152009',
    tile_grades: [
      {
        grade: 70.47500000000001,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 70.47500000000001,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 33,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 62.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 49,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 76.1238,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 67.8,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '48905367',
    tile_grades: [
      {
        grade: 0,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 0,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 33,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 100,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 77.25,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 0,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 0,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '59540503',
    tile_grades: [
      {
        grade: 64.475,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 64.475,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 87.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 87.25,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 72.7272,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 73.3,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '45476233',
    tile_grades: [
      {
        grade: 52.449999999999996,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 52.449999999999996,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 87.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 92,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 59.3406,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 58.9,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '29376337',
    tile_grades: [
      {
        grade: 67.75,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 67.75,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 100,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 54.75,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 74.95830000000001,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 100,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '27034712',
    tile_grades: [
      {
        grade: 73.925,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 73.925,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 62.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 32.5,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 75.89070000000001,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 85,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '90434281',
    tile_grades: [
      {
        grade: 54.175000000000004,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 54.175000000000004,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 100,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 88.25,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 57.3426,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 58.3,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '22976781',
    tile_grades: [
      {
        grade: 74.05,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 74.05,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 75,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 70,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 78.38820000000001,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 92.5,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '35251913',
    tile_grades: [
      {
        grade: 27.875,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 27.875,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 33,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 37.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 42.75,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 21.4119,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 0,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '28624178',
    tile_grades: [
      {
        grade: 37.825,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 37.825,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 0,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 25,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 32.5,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 50.3829,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 71.7,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '76262947',
    tile_grades: [
      {
        grade: 74.2,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 74.2,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 33,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 25,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 78.5,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 79.92,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 87.5,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '41803722',
    tile_grades: [
      {
        grade: 83.9,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 83.9,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 66,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 50,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 83.5,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 86.6466,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 90,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '41149744',
    tile_grades: [
      {
        grade: 0,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 0,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 0,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 25,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 32.5,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 0,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 0,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '16967126',
    tile_grades: [
      {
        grade: 84.07499999999999,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 84.07499999999999,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 100,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 71,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 86.6466,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 90,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '41898388',
    tile_grades: [
      {
        grade: 79.15,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 79.15,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 87.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 53.75,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 83.8494,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 73.3,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '23400528',
    tile_grades: [
      {
        grade: 57.1,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 57.1,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 100,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 53.25,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 59.87340000000001,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 64.4,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '20936679',
    tile_grades: [
      {
        grade: 57.525,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 57.525,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 50,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 70.25,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 76.6233,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 78.3,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '81005245',
    tile_grades: [
      {
        grade: 0,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 0,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 66,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 75,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 74.75,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 0,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 0,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '42345728',
    tile_grades: [
      {
        grade: 88.05000000000001,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 88.05000000000001,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 100,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 53,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 90.0099,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 81.1,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '43754947',
    tile_grades: [
      {
        grade: 0,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 0,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 33,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 50,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 85,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 0,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 0,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '55571292',
    tile_grades: [
      {
        grade: 62.55,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 62.55,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 62.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 48.75,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 69.06420000000001,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 68.9,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '54264654',
    tile_grades: [
      {
        grade: 63.975,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 63.975,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 66,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 87.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 49.75,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 85.21470000000001,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 82.5,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '24585559',
    tile_grades: [
      {
        grade: 66.325,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 66.325,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 87.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 80,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 72.5607,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 61.4,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '23744275',
    tile_grades: [
      {
        grade: 97.5,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 97.5,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 75,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 32.5,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 99.3006,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 100,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '43219917',
    tile_grades: [
      {
        grade: 66.5,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 66.5,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 62.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 88,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 73.06020000000001,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 83.3,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '74886921',
    tile_grades: [
      {
        grade: 79.925,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 79.925,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 50,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 66.75,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 89.5104,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 80.6,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '81888190',
    tile_grades: [
      {
        grade: 77.675,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 77.675,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 66,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 75,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 32.5,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 78.72120000000001,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 82.8,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '27817769',
    tile_grades: [
      {
        grade: 22.225,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 22.225,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 75,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 80,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 29.603700000000003,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 88.9,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '21276717',
    tile_grades: [
      {
        grade: 0,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 0,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 100,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 32.5,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 0,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 0,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '46666218',
    tile_grades: [
      {
        grade: 65.15,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 65.15,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 75,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 83.5,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 73.22670000000001,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 64.4,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '96600883',
    tile_grades: [
      {
        grade: 71.3,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 71.3,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 33,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 100,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 77.25,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 72.3942,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 60,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '53036575',
    tile_grades: [
      {
        grade: 84.07499999999999,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 84.07499999999999,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 100,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 32.5,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 86.6466,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 90,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '55249485',
    tile_grades: [
      {
        grade: 72.05,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 72.05,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 75,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 82,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 76.1238,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 78.9,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '46647543',
    tile_grades: [
      {
        grade: 17.225,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 17.225,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 87.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 83.25,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 22.943700000000003,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 68.9,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '70805720',
    tile_grades: [
      {
        grade: 82.875,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 82.875,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 100,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 74.25,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 88.14510000000001,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 80,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '77161172',
    tile_grades: [
      {
        grade: 89.125,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 89.125,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 62.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 70.5,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 90.07650000000001,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 90,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '97222205',
    tile_grades: [
      {
        grade: 16.775,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 16.775,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 75,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 40.25,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 22.3443,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 0,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '20380320',
    tile_grades: [
      {
        grade: 0,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 0,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 66,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 62.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 84,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 0,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 0,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '96955357',
    tile_grades: [
      {
        grade: 37.675,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 37.675,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 66,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 62.5,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 75.25,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 50.183099999999996,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 73.6,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '95366984',
    tile_grades: [
      {
        grade: 0,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 0,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 75,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 59.75,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 0,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 0,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '45844627',
    tile_grades: [
      {
        grade: 70.1,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 70.1,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 100,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 32.5,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 93.3732,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 82.2,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '32324131',
    tile_grades: [
      {
        grade: 84.325,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 84.325,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 33,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 25,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 73,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 95.904,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 97.8,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '66889858',
    tile_grades: [
      {
        grade: 38.55,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 38.55,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 99,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 75,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 54.5,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 51.3486,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 85.6,
        tile_id: 9,
        max: 10,
      },
    ],
  },
  {
    userID: '86899376',
    tile_grades: [
      {
        grade: 58.025000000000006,
        tile_id: 1,
        max: 10,
      },
      {
        grade: 58.025000000000006,
        tile_id: 8,
        max: 10,
      },
      {
        grade: 66,
        tile_id: 2,
        max: 5,
      },
      {
        grade: 75,
        tile_id: 4,
        max: 100,
      },
      {
        grade: 32.5,
        tile_id: 5,
        max: 50,
      },
      {
        grade: 56.4102,
        tile_id: 7,
        max: 100,
      },
      {
        grade: 66.7,
        tile_id: 9,
        max: 10,
      },
    ],
  },
];

export { MOCK_PEER_TILE_GRADES, MOCK_SUBMISSIONS, MOCK_TILE_GRADES };
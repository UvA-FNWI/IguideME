import { HistoricTileGrades } from "../components/StudentDashboard/TileHistoricGraph/types";

export const MOCK_GRADE_HISTORY: Map<number, HistoricTileGrades> = new Map([[
    1,
    {
        dates: ["1","2","3","4","5","6","7"],
        user_avg: [6,5,7,8,6,7,7],
        peer_avg: [5.5,6.3,7,8,6,5,5],
        peer_max: [8,9,8,9,7,8,9],
        peer_min: [3,1,4,5,3,4,3]
    }
]]);

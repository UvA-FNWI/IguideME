import { Tile } from "../../models/app/Tile";

export const MOCK_TILES: Tile[] = [
  {
    "id": 1,
    "group_id": 1,
    "title": "Quizzes",
    "position": 1,
    "content": "ENTRIES",
    "type": "ASSIGNMENTS",
    "visible": true,
    "wildcard": false,
    "graph_view": true
  }, {
    "id": 2,
    "group_id": 1,
    "title": "Perusall",
    "position": 2,
    "content": "ENTRIES",
    "type": "EXTERNAL_DATA",
    "visible": false,
    "wildcard": false,
    "graph_view": false
  }, {
    "id": 3,
    "group_id": 1,
    "title": "Attendance",
    "position": 4,
    "content": "BINARY",
    "type": "EXTERNAL_DATA",
    "visible": true,
    "wildcard": false,
    "graph_view": false
  }, {
    "id": 4,
    "group_id": 1,
    "title": "Practice Sessions",
    "position": 3,
    "content": "ENTRIES",
    "type": "EXTERNAL_DATA",
    "visible": true,
    "wildcard": false,
    "graph_view": false
  }, {
    "id": 5,
    "group_id": 2,
    "title": "Exam Grades",
    "position": 1,
    "content": "ENTRIES",
    "type": "ASSIGNMENTS",
    "visible": true,
    "wildcard": false,
    "graph_view": false
  }
]
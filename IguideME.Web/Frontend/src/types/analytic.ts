enum ActionTypes {
  Page,
  Tile,
  TileView,
  Theme,
  Notifications,
  SettingChange,
}

interface EventReturnType {
  timestamp: number;
  user_id: string;
  action: ActionTypes;
  action_detail: string;
  session_id: number;
  course_id: number;
}

interface TrackEventProps {
  userID: string;
  action: ActionTypes;
  actionDetail: string;
  courseID: number;
}

interface ConsentInfoReturnType {
  current_consent: number;
  prev_consent: number;
  total: number;
}

export { ActionTypes };
export type { ConsentInfoReturnType, EventReturnType, TrackEventProps };

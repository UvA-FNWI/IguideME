export interface IEntryItem {
  name: string;
  status: "passed" | "failed" | "unstarted";
  referer: string;
}

export interface IEntry {
  name: string;
  grade: number | null;
  items: IEntryItem[] | null,
  metadata?: any;
  extra_wide?: boolean;
  hide_action_button?: boolean;
}

export interface IPeerComparison {
  minimum: number;
  maximum: number;
  average: number;
}

export interface ITile {
  rank: number;
  type: "activity" | "grade" | "outcome";
  name: string;
  visible: boolean;

  progress: number | null;
  average_grade?: number | null;

  peer_comparison: IPeerComparison;

  entry_view_type: "components" | "graph";
  entries: IEntry[];
}
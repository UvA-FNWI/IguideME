export interface PredictiveModel {
  id: number;
  course_id: number;
  mse: number;
  entry_collection: string;
  theta: ModelTheta[];
}

export interface ModelTheta {
  tile_id: number | null;
  entry_id: number | null;
  intercept: boolean;
  meta_key: string;
  value: number;
}

export interface PredictedGrade {
  date: string;
  grade: number;
}
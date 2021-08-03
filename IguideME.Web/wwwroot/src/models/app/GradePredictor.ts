export interface GradePredictorWeight {
  weight: number,
  tileId: number,
  entryId: number,
  expectedGrade: number
}

export interface RelationshipRegistry {
  tile_id: number;
  entry_id: number;
  source_key: string;
  meta_key: string;
  theta?: number;
}

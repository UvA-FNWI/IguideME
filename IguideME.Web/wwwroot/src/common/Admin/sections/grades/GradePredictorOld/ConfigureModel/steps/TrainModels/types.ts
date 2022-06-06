import {RelationshipRegistry} from "../../../../../../../../models/app/GradePredictor";
import {PredictiveModel} from "../../../../../../../../models/app/PredictiveModel";

export interface IProps {
  data: any[];
  setModels: (models: PredictiveModel[]) => any;
  registry: RelationshipRegistry[];
}
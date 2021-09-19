import {PredictiveModel} from "../../../../../models/app/PredictiveModel";

export interface IProps {

}

export interface IState {
  loaded: boolean;
  models: PredictiveModel[];
  openConfigure: boolean;
}
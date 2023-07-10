export interface IStep {
  isStepCompleted: () => boolean;
  validate: () => boolean;
}

export interface GradePredictionModel {
  intercept: number;
  parameters: GradePredictionModelParameter[];
}

export interface GradePredictionModelParameter {
  parameterID: number;
  weight: number;
}

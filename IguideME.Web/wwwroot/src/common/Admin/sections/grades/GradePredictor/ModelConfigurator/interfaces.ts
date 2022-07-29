export interface IStep {
    isStepCompleted: () => boolean,
    validate: () => boolean,
}

export interface GradePredictionModel {
    parameters: GradePredictionModelParameter[]
}

export interface GradePredictionModelParameter {
    parameterID: number,
    weight: number,
}

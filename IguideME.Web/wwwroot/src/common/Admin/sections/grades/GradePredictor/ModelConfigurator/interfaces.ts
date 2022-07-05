export interface IStep {
    isStepCompleted: () => boolean,
    validate: () => boolean,
}

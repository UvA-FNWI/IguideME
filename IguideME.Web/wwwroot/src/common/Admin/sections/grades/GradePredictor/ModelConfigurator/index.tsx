import "./style.scss"

import React, { Component } from "react"
import { Alert, Button, message, Steps } from "antd";
import Loading from "../../../../../../components/utils/Loading"
import UploadData from "./UploadData"
import LinkLiveData from "./LinkLiveData"
import TrainModel from "./TrainModel"
import Finish from "./Finish"
import { GradesDatasets } from "../types"

interface IProps {

}

interface IState {
    loaded: boolean
    currentStep: number,
    gradesDatasets: GradesDatasets,
    finalGradesDatasetName: string,
    model: string,
}

export default class ModelConfigurator extends Component<IProps, IState> {

    steps = ["Upload historic data", "Link to live data", "Train model", "Done!"]

    state = {
        loaded: false,
        currentStep: 1,
        gradesDatasets: {},
        finalGradesDatasetName: "",
        model: "",
    }

    componentDidMount() {
        this.setState({ loaded: true })
    }

    renderStep() {
        const { currentStep, gradesDatasets, finalGradesDatasetName, model } = this.state
        switch (currentStep) {
            default:
            case 1: return <UploadData
                parentSetGradesDatasets={(gds: GradesDatasets) =>
                    this.setState({ gradesDatasets: gds })} />

            case 2: return <LinkLiveData
                gradesDatasets={gradesDatasets}
                parentSetFinalGradesDatasetName={(name: string) =>
                    this.setState({ finalGradesDatasetName: name })} />

            case 3: return <TrainModel
                gradesDatasets={gradesDatasets}
                finalGradesDatasetName={finalGradesDatasetName}
                parentSetModel={(model: string) =>
                    this.setState({ model: model })} />

            case 4: return <Finish
                model={model} />
        }
    }

    nextStep = () => {
        const { currentStep } = this.state
        this.setState({
            currentStep: Math.min(this.steps.length, currentStep + 1)
        })
    }

    previousStep = () => {
        const { currentStep } = this.state
        this.setState({
            currentStep: Math.max(1, currentStep - 1)
        })
    }

    render(): React.ReactNode {
        const { currentStep, loaded } = this.state;

        if (!loaded) return <Loading small={true} />

        return (
            <div>
                <Steps current={currentStep - 1}>
                    {this.steps.map(s => <Steps.Step key={s} title={s} />)}
                </Steps>
                <div className="stepsContent">
                    {this.renderStep()}
                </div>
                <div className="stepsAction">
                    {currentStep > 1 && (
                        <Button
                            className="previousBtn"
                            onClick={this.previousStep}>
                            Previous
                        </Button>
                    )}
                    {currentStep === this.steps.length && (
                        <Button
                            className="doneBtn"
                            type="primary">
                            Done
                        </Button>
                    )}
                    {currentStep < this.steps.length && (
                        <Button
                            className="nextBtn"
                            type="primary"
                            onClick={this.nextStep}>
                            Next
                        </Button>
                    )}
                </div>
            </div>
        )
    }
}

import React, { Component } from "react"
import { Alert, Button, message, Steps } from "antd";
import Loading from "../../../../../../components/utils/Loading"
import "./style.scss"

interface IProps {

}

interface IState {
    loaded: boolean
    currentStep: number
}

export default class ModelConfigurator extends Component<IProps, IState> {

    steps = ["Upload historic data", "Link to live data", "Train model", "Done!"]

    state = {
        loaded: false,
        currentStep: 1
    }

    componentDidMount() {
        this.setState({ loaded: true })
    }

    renderStep() {
        const { currentStep } = this.state
        switch (currentStep) {
            default:
            case 1:
                return "1"
            case 2:
                return "2"
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
            <div id={"configureModel"}>
                <Steps current={currentStep - 1}>
                    {this.steps.map(s => <Steps.Step key={s} title={s} />)}
                </Steps>
                <div className="stepsContent">
                    {this.renderStep()}
                </div>
                <div className="stepsAction">
                    {currentStep < this.steps.length && (
                        <Button
                            className="nextBtn"
                            type="primary"
                            onClick={this.nextStep}>
                            Next
                        </Button>
                    )}
                    {currentStep === this.steps.length && (
                        <Button
                            className="doneBtn"
                            type="primary">
                            Done
                        </Button>
                    )}
                    {currentStep > 1 && (
                        <Button
                            className="previousBtn"
                            onClick={this.previousStep}>
                            Previous
                        </Button>
                    )}
                </div>
            </div>
        )
    }
}

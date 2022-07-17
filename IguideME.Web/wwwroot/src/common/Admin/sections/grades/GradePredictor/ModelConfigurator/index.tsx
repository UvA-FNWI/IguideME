import "./style.scss";

import React, { Component, RefObject } from "react";
import { Alert, Button, message, Steps } from "antd";
import Loading from "../../../../../../components/utils/Loading";

import UploadData, { UploadDataMock } from "./UploadData";
import LinkLiveData, { LinkLiveDataMock } from "./LinkLiveData";
import TrainModel, { TrainModelMock } from "./TrainModel";
import Finish from "./Finish";

import { GradesDatasets } from "../types";
import { IStep } from "./interfaces";
import { Mock } from "../../../../../../mock";

const { createRef } = React;

interface IProps { }

interface IState {
    loaded: boolean;
    currentStep: number;
    gradesDatasets: GradesDatasets;
    finalGradesDatasetName: string;
    gradesDatasetTilePairs: { [name: string]: number };
    model: string;
    childRef: RefObject<any>;
}

export default class ModelConfigurator extends Component<IProps, IState> {
    mock = new ModelConfiguratorMock(/* enable? */ true);

    steps = ["Upload historic data", "Link to live data", "Train model", "Done!"];

    state = {
        loaded: false,
        currentStep: 1,
        gradesDatasets: {},
        finalGradesDatasetName: "",
        gradesDatasetTilePairs: {},
        model: "",
        childRef: createRef<any>(),
    };

    componentDidMount() {
        if (this.mock.enabled)
            this.setState({
                currentStep: this.mock.currentStep,
                gradesDatasets: this.mock.gradesDatasets,
                finalGradesDatasetName: this.mock.finalGradesDatasetName,
                model: this.mock.model,
            });

        this.setState({
            loaded: true,
        });
    }

    renderStep() {
        const {
            currentStep,
            gradesDatasets,
            finalGradesDatasetName,
            gradesDatasetTilePairs,
            model,
            childRef,
        } = this.state;

        switch (currentStep) {
            default:
            case 1:
                return (
                    <UploadData
                        ref={childRef}
                        parentSetGradesDatasets={(gds: GradesDatasets) =>
                            this.setState({ gradesDatasets: gds })
                        }
                        parentSetFinalGradesDatasetName={(name: string) =>
                            this.setState({ finalGradesDatasetName: name })
                        }
                    />
                );

            case 2:
                return (
                    <LinkLiveData
                        ref={childRef}
                        gradesDatasets={gradesDatasets}
                        finalGradesDatasetName={finalGradesDatasetName}
                        parentSetGradesDatasetTilePairs={(pairs: { [name: string]: number }) =>
                            this.setState({ gradesDatasetTilePairs: pairs })
                        }
                    />
                );

            case 3:
                return (
                    <TrainModel
                        ref={childRef}
                        gradesDatasets={gradesDatasets}
                        gradesDatasetTilePairs={gradesDatasetTilePairs}
                        finalGradesDatasetName={finalGradesDatasetName}
                        parentSetModel={(model: string) =>
                            this.setState({ model: model })
                        }
                    />
                );

            case 4:
                return (
                    <Finish
                        ref={childRef}
                        model={model} />
                );
        }
    }

    nextStep = () => {
        const { currentStep, childRef } = this.state;
        let w = childRef! as RefObject<IStep>;
        if (!w.current?.isStepCompleted()) return;
        this.setState({
            currentStep: Math.min(this.steps.length, currentStep + 1),
        });
    };

    previousStep = () => {
        const { currentStep } = this.state;
        this.setState({
            currentStep: Math.max(1, currentStep - 1),
        });
    };

    render(): React.ReactNode {
        const { currentStep, loaded } = this.state;

        if (!loaded) return <Loading small={true} />;

        return (
            <div>
                <Steps current={currentStep - 1}>
                    {this.steps.map((s) => (
                        <Steps.Step key={s} title={s} />
                    ))}
                </Steps>
                <div className="stepsContent">{this.renderStep()}</div>
                <div className="stepsAction">
                    {currentStep > 1 && (
                        <Button className="previousBtn" onClick={this.previousStep}>
                            Previous
                        </Button>
                    )}
                    {currentStep === this.steps.length && (
                        <Button className="doneBtn" type="primary">
                            Done
                        </Button>
                    )}
                    {currentStep < this.steps.length && (
                        <Button className="nextBtn" type="primary" onClick={this.nextStep}>
                            Next
                        </Button>
                    )}
                </div>
            </div>
        );
    }
}

class ModelConfiguratorMock extends Mock {
    mockCurrentStep = true;

    currentStep = this.enabled && this.mockCurrentStep ? 3 : 1;

    gradesDatasets = new UploadDataMock(this.enabled).gradesDatasets;
    finalGradesDatasetName = new UploadDataMock(this.enabled)
        .finalGradesDatasetName;
    model = new TrainModelMock(this.enabled).model;
}

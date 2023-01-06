import "./style.scss";

import React, { Component, RefObject } from "react";
import { Button, Steps } from "antd";

import UploadData from "./UploadData";
import LinkLiveData from "./LinkLiveData";
import TrainModel from "./TrainModel";
import Finish from "./Finish";
import { ModelConfiguratorMock } from "./mocking";

import { GradesDatasets } from "../types";
import { GradePredictionModel, IStep } from "./interfaces";
import { Link } from "react-router-dom";

const { createRef } = React;

interface IProps {}

interface IState {
  currentStep: number;
  gradesDatasets: GradesDatasets;
  finalGradesDatasetName: string;
  gradesDatasetTilePairs: { [name: string]: number };
  model: GradePredictionModel | null;
  childRef: RefObject<any>;
}

export default class ModelConfigurator extends Component<IProps, IState> {
  mock = new ModelConfiguratorMock(/* enable? */ true);

  steps = ["Upload historic data", "Link to live data", "Train model", "Done!"];

  state = {
    currentStep: this.mock.currentStep,
    gradesDatasets: this.mock.gradesDatasets,
    finalGradesDatasetName: this.mock.finalGradesDatasetName,
    gradesDatasetTilePairs: this.mock.gradesDatasetTilePairs,
    model: this.mock.model,
    childRef: createRef<any>(),
  };

  componentDidMount() {}

  renderStep() {
    const {
      currentStep,
      gradesDatasets,
      finalGradesDatasetName,
      gradesDatasetTilePairs,
      model,
      childRef,
    } = this.state;

    // console.log("model" model);
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
            parentSetGradesDatasetTilePairs={(pairs: {
              [name: string]: number;
            }) => this.setState({ gradesDatasetTilePairs: pairs })}
          />
        );

      case 3:
        return (
          <TrainModel
            ref={childRef}
            gradesDatasets={gradesDatasets}
            gradesDatasetTilePairs={gradesDatasetTilePairs}
            finalGradesDatasetName={finalGradesDatasetName}
            parentSetModel={(model: GradePredictionModel) =>
              this.setState({ model: model })
            }
          />
        );

      case 4:
        return <Finish ref={childRef} model={model!} />;
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
    const { currentStep } = this.state;

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
            <Link to= "/admin">
              <Button className="doneBtn" type="primary">
                Finish
              </Button>
            </Link>
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

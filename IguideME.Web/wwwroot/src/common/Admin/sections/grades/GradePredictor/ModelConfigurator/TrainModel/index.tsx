import React, { Component } from "react";
import MLR from "ml-regression-multivariate-linear";

import { StudentGrades, GradesDatasets } from "../../types";
import { IStep } from "../interfaces";
import { Mock } from "../../../../../../../mock";

interface IProps {
  gradesDatasets: GradesDatasets;
  gradesDatasetTilePairs: { [name: string]: number };
  finalGradesDatasetName: string;

  parentSetModel: Function;
}

interface IState {
  gradesDatasets: GradesDatasets;
  model: string;
}

export default class TrainModel
  extends Component<IProps, IState>
  implements IStep
{
  mock = new TrainModelMock(/* enable? */ true);

  state = {
    gradesDatasets: {},
    model: this.mock.model,
  };

  componentDidMount() {
    if (this.mock.enabled) {
      if (this.mock.mockModel) this.onModelTrained();
    }
  }

  onModelTrained() {
    const { parentSetModel } = this.props;
    const { model } = this.state;

    parentSetModel(model);
  }

  ensureFinalGradeExists() {
    const { gradesDatasets, finalGradesDatasetName } = this.props;

    let fgStudentIDs = Object.entries(gradesDatasets)
      .filter((x) => x[0] === finalGradesDatasetName) // select students with final grade
      .map((x) => x[1] as StudentGrades)
      .flatMap(Object.keys) // get all student IDs
      .map((x) => parseInt(x))
      .slice(0); // deduplicate

    let wGradesDatasets = gradesDatasets as { [name: string]: StudentGrades };

    Object.keys(wGradesDatasets).forEach((k) => {
      Object.keys(wGradesDatasets[k])
        .map((x) => parseInt(x))
        .filter((sID) => !(sID in fgStudentIDs))
        .forEach((sID) => {
          delete wGradesDatasets[k][sID];
        });
    });

    this.setState({ gradesDatasets: wGradesDatasets });
  }

  trainModels() {
    const { gradesDatasets, finalGradesDatasetName, gradesDatasetTilePairs } =
      this.props;

    // housekeeping on the datasets to ensure clean data
    this.ensureFinalGradeExists();

    // wOutputs :: [[sID, finalGrade]] (per student)
    const wOutputs = Object.keys(gradesDatasets[finalGradesDatasetName])
      .map((sID) => parseInt(sID))
      .map((sID) => [sID, gradesDatasets[finalGradesDatasetName][sID]]);

    // dsNames :: ["quizA", "quizB", ..., "quizN"]
    let dsNames = Object.keys(gradesDatasets).filter(
      (dsName) => dsName !== finalGradesDatasetName
    );

    // wInputs :: [[sID, quizAGrade, quizBGrade, ..., quizNGrade]] (per student)
    const wInputs = Object.values(wOutputs)
      .map((wOutput) => wOutput[0]) // results in a list of sID's
      .map((sID) => [
        sID,
        ...Object.values(dsNames).map((dsName) => gradesDatasets[dsName][sID]),
      ]);

    // outputs :: [finalGrade] (per student)
    // outputs is sorted by studentID
    const outputs = wOutputs
      .sort((a, b) => a[0] - b[0]) // sort by sID (first element)
      .map((r) => r.slice(1)); // drop sID

    // inputs :: [[quizAGrade, quizBGrade, ..., quizNGrade]] (per student)
    // inputs is sorted by studentID
    const inputs = wInputs
      .sort((a, b) => a[0] - b[0]) // sort by sID (first element)
      .map((r) => r.slice(1)); // drop sID

    // use inputs to predict outputs (quiz grades -> final grade)
    // each student is a datapoint
    const mlr = new MLR(inputs, outputs, { intercept: false });

    let modelWithMetadata = {
      model: JSON.stringify(mlr),
      modelColumns: dsNames.map((dsName) => gradesDatasetTilePairs[dsName]),
    };

    console.log(JSON.stringify(modelWithMetadata));

    console.log(mlr.predict([5, 7, 8, 9]));
    console.log(mlr.predict([9, 8, 7, 5]));
    console.log(mlr.predict([9, 9, 9, 9]));
    console.log(mlr.predict([10, 10, 10, 10]));
    console.log(mlr.predict([1, 1, 1, 1]));
    console.log(dsNames);
  }

  validate(): boolean {
    return true;
  }

  isStepCompleted = this.validate;

  render(): React.ReactNode {
    return <div>Train model</div>;
  }
}

export class TrainModelMock extends Mock {
  mockModel = true;

  model = this.enabled && this.mockModel ? "" : "";
}

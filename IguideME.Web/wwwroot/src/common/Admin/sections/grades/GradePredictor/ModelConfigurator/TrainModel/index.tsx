import "./style.scss";

import React, { Component } from "react";
import MLR from "ml-regression-multivariate-linear";
import { Button, Row, Col, Divider, InputNumber } from "antd";

import TileController from "../../../../../../../api/controllers/tile";
import { Tile } from "../../../../../../../models/app/Tile";

import { StudentGrades, GradesDatasets } from "../../types";
import { GradePredictionModel, IStep } from "../interfaces";
import {TrainModelMock} from "../mocking";

interface IProps {
  gradesDatasets: GradesDatasets;
  gradesDatasetTilePairs: { [name: string]: number };
  finalGradesDatasetName: string;

  parentSetModel: Function;
}

interface IState {
  gradesDatasets: GradesDatasets;
  model: GradePredictionModel | null;
  modelWithMetadata: { model: any; modelColumns: number[] } | null;
  modelTestingValues: Map<number, number>//{ [tileID: number]: number };
  predictedGrade: number;
  tiles: Tile[];
}

export default class TrainModel
  extends Component<IProps, IState>
  implements IStep
{
  mock = new TrainModelMock(/* enable? */ true);

  state = {
    gradesDatasets: {},
    model: this.mock.model,
    modelWithMetadata: this.mock.modelWithMetadata,
    modelTestingValues: new Map<number, number>(),
    predictedGrade: 0,
    tiles: [],
  };

  componentDidMount() {
    if (this.mock.enabled) {
      if (this.mock.mockModel) this.onModelTrained();
    }

    // TODO: previous step should load tiles and keep them in the parent (modelconfigurator), or probably better: gradesdatasettile pairs should contain a tile (/entry) object
    TileController.getTiles().then(async (tiles) => {
      tiles = tiles.filter((t) => t.content === "ENTRIES");
      this.setState({ tiles: tiles });
    });

    this.recalculateTestPrediction();
  }

  onModelTrained() {
    const { parentSetModel } = this.props;
    const { model } = this.state;

    if (!model) return;

    parentSetModel(model!);
  }

  ensureFinalGradeExists() {
    const { gradesDatasets, finalGradesDatasetName } = this.props;

    let fgStudentIDs = Object.entries(gradesDatasets)
      .filter((x) => x[0] === finalGradesDatasetName) // select students with final grade
      .map((x) => x[1] as StudentGrades)
      .flatMap(Object.keys) // get all student IDs
      .map((x) => parseInt(x))
      .slice(0); // deduplicate

    Object.keys(gradesDatasets).forEach((k) => {
      Object.keys(gradesDatasets[k])
        .map((x) => parseInt(x))
        .filter((sID) => !(sID in fgStudentIDs))
        .forEach((sID) => {
          delete gradesDatasets[k][sID];
        });
    });

    this.setState({ gradesDatasets: gradesDatasets });
  }

  trainModels() {
    const { gradesDatasets, finalGradesDatasetName, gradesDatasetTilePairs } =
      this.props;

    // TODO: somehow this is deleting the entirety of gradesDatasets
    // housekeeping on the datasets to ensure clean data
    // this.ensureFinalGradeExists();

    // wOutputs :: [[sID, finalGrade]] (per student)
    const wOutputs = Object.keys(gradesDatasets[finalGradesDatasetName])
      .map((sID) => parseInt(sID))
      .map((sID) => [sID, gradesDatasets[finalGradesDatasetName][sID]]);

    // dsNames :: ["quizA", "quizB", ..., "quizN"]
    const dsNames = Object.keys(gradesDatasets).filter(
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
    const mlrModel: any = mlr.toJSON();
    const weights: number[] = mlrModel.weights.map((w: number[]) => w[0]);
    const modelParameterIDs = dsNames.map(
      (dsName) => gradesDatasetTilePairs[dsName]
    );

    const model: GradePredictionModel = {
      intercept: 0, // not using this data, but accounting for it in the datamodel
      parameters: modelParameterIDs.map((id: number, i: number) => {
        return {
          parameterID: id,
          weight: weights[i],
        };
      }),
    };

    const modelWithMetadata = {
      model: mlrModel,
      modelColumns: dsNames.map((dsName) => gradesDatasetTilePairs[dsName]),
    };

    this.setState({
      model: model,
      modelWithMetadata: modelWithMetadata,
    }, () => {
      this.recalculateTestPrediction();
      this.onModelTrained();
    });

  }

  recalculateTestPrediction() {
    let { modelWithMetadata, modelTestingValues }: IState = this.state;
    if (!modelWithMetadata) return;

    let _modelWithMetadata: {model: any, modelColumns: number[]} = modelWithMetadata;

    if (modelTestingValues.size !== _modelWithMetadata.model.weights.length) {
      _modelWithMetadata.modelColumns.forEach(
        (tID) => (modelTestingValues.set(tID, 5))
      );

      this.setState({
        modelTestingValues: modelTestingValues,
      });
    }

    const mlr = MLR.load(_modelWithMetadata!.model);

    // maintain same order as when the model was trained
    const inputs: number[] = [];
    let tildID, entry;
    for (let i = 0; i < _modelWithMetadata!.modelColumns.length; i++) {
      tildID = _modelWithMetadata!.modelColumns[i]
      entry = modelTestingValues.get(tildID);
      if (entry) {
        inputs.push(entry);
      }
    }

    let grade = mlr.predict(inputs)[0]

    this.setState({
      predictedGrade: grade,
    });
  }

  getTileByID(id: number): Tile | null {
    const { tiles }: IState = this.state;
    const tile = tiles.find((t: Tile) => t.id === id);
    return tile ? tile : null;
  }

  validate(): boolean {
    const { model } = this.state;
    return model !== null;
  }

  isStepCompleted = this.validate;

  render(): React.ReactNode {

    let _modelWithMetadata: {model: any, modelColumns: number[]} = this.state.modelWithMetadata!;

    return (
      <div>
        <Row>
          <Col xs={24} md={24}>
            <h2>Train the grade predicting model</h2>

            <Divider />
          </Col>
        </Row>

        <Row>
          <Col xs={24} md={14}>
            {this.state.model !== null && (
              <div>
                <h3>Success!</h3>
                <p>
                  The model has been trained successfully. You can preview it
                  below by inputting sample values.
                </p>

                {this.state.modelWithMetadata &&
                  _modelWithMetadata.modelColumns.map(
                    (tileID: number, index: number) => {
                      const { modelWithMetadata }: IState = this.state;
                      const weight = modelWithMetadata!.model.weights[index][0];
                      return (
                        <div key={weight} className="grade-input-row">
                          <Row>
                            <Col xs={24} md={10}>
                              {this.getTileByID(tileID) ? this.getTileByID(tileID)!.title : null} (weight:{" "}
                              {weight.toFixed(1)})
                            </Col>
                            <Col xs={24} md={5}>
                              <InputNumber
                                min={0}
                                max={10}
                                defaultValue={5}
                                onChange={(v) => {
                                  if (!v) {return}

                                  let { modelTestingValues }: IState = this.state;

                                  modelTestingValues.set(tileID, v);
                                  this.setState({
                                    modelTestingValues: modelTestingValues,
                                  }, () => this.recalculateTestPrediction());
                                }}
                              />
                            </Col>
                            <Col xs={24} md={9}></Col>
                          </Row>
                        </div>
                      );
                    }
                  )}

                {this.state.predictedGrade && (
                  <Row>
                    <h4>
                      Predicted grade: {this.state.predictedGrade.toFixed(1)}
                    </h4>
                  </Row>
                )}
              </div>
            )}

            {this.state.model == null && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div
                  style={{
                    background:
                      "url(/assets/img/illustrations/train_models.svg)",
                    marginBottom: 30,
                    height: 200,
                    width: "100%",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
                <Button
                  type={"primary"}
                  size={"large"}
                  onClick={() => this.trainModels()}
                >
                  Train Model
                </Button>
              </div>
            )}
          </Col>

          <Col xs={24} md={10}>
            <Row>
              <Col xs={24} md={24}>
                <p>
                  The model will be trained on your machine using linear
                  regression.
                </p>
                <p>This won't take long.</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

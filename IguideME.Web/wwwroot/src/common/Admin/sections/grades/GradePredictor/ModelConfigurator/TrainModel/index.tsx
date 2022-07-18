import "./style.scss";

import React, { Component } from "react";
import MLR from "ml-regression-multivariate-linear";
import { Button, Row, Col, Divider, InputNumber } from "antd";

import TileController from "../../../../../../../api/controllers/tile";
import { Tile } from "../../../../../../../models/app/Tile";

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
    model: { model: any, modelColumns: number[] } | null;
    modelTestingValues: { [tileID: number]: number };
    predictedGrade: number;
    tiles: Tile[];
}

export default class TrainModel
    extends Component<IProps, IState>
    implements IStep {

    mock = new TrainModelMock(/* enable? */ false);

    state = {
        gradesDatasets: {},
        model: this.mock.model,
        modelTestingValues: {},
        predictedGrade: 0,
        tiles: [],
    };

    componentDidMount() {
        if (this.mock.enabled) {
            if (this.mock.mockModel) this.onModelTrained();
        }

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
            model: mlr.toJSON(),
            modelColumns: dsNames.map((dsName) => gradesDatasetTilePairs[dsName]),
        };

        this.setState({
            model: modelWithMetadata
        });

        this.recalculateTestPrediction();

        this.onModelTrained();
    }

    recalculateTestPrediction() {
        let { model, modelTestingValues }: IState = this.state;
        if (!model) return;
        if (Object.keys(modelTestingValues).length !== model?.model.weights.length) {
            model?.modelColumns.forEach(tID => modelTestingValues[tID] = 5);
            this.setState({
                modelTestingValues: modelTestingValues
            });
        }

        const mlr = MLR.load(model!.model);

        // maintain same order as when the model was trained
        const inputs = model!.modelColumns
            .map(tildID => modelTestingValues[tildID]);

        this.setState({
            predictedGrade: mlr.predict(inputs)[0]
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
                                    The model has been trained successfully.
                                    You can preview it below by inputting sample values.
                                </p>

                                {this.state.model && this.state.model.modelColumns.map((tileID, index) => {
                                    const { model }: IState = this.state;
                                    const weight = model!.model.weights[index][0];
                                    return (
                                        <div key={weight} className="grade-input-row">
                                            <Row>
                                                <Col xs={24} md={10}>
                                                    {this.getTileByID(tileID)?.title} (weight: {weight.toFixed(1)})
                                                </Col>
                                                <Col xs={24} md={5}>
                                                    <InputNumber
                                                        min={0}
                                                        max={10}
                                                        defaultValue={5}
                                                        onChange={(v) => {
                                                            let { modelTestingValues }: IState = this.state;
                                                            const _v: any = v; // this is incredibly frustrating
                                                            modelTestingValues[tileID] = parseFloat(_v);
                                                            this.setState({
                                                                modelTestingValues: modelTestingValues
                                                            });
                                                            this.recalculateTestPrediction();
                                                        }}
                                                    />
                                                </Col>
                                                <Col xs={24} md={9}>
                                                </Col>
                                            </Row>
                                        </div>
                                    )
                                })}

                                {this.state.predictedGrade && (
                                    <Row>
                                        <h4>Predicted grade: {this.state.predictedGrade.toFixed(1)}</h4>
                                    </Row>
                                )}
                            </div>
                        )}

                        {this.state.model == null && (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div style={{
                                    background: 'url(/assets/img/illustrations/train_models.svg)',
                                    marginBottom: 30,
                                    height: 200,
                                    width: '100%',
                                    backgroundSize: 'contain',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }} />
                                <Button
                                    type={"primary"}
                                    size={"large"}
                                    onClick={() => this.trainModels()}>
                                    Train Model
                                </Button>
                            </div>
                        )}
                    </Col>

                    <Col xs={24} md={10}>
                        <Row>
                            <Col xs={24} md={24}>
                                <p>
                                    The model will be trained on your machine using linear regression.
                                </p>
                                <p>
                                    This won't take long.
                                </p>
                            </Col>
                        </Row>
                    </Col>

                </Row>

            </div>
        );
    }
}

export class TrainModelMock extends Mock {
    mockModel = true;

    model = this.enabled && this.mockModel ? { "model": { "name": "multivariateLinearRegression", "weights": [[-0.20628158982515943], [0.5987301721162606], [0.7351437498019004], [-0.05163026454991204]], "inputs": 4, "outputs": 1, "intercept": false, "summary": { "regressionStatistics": { "standardError": 0.9270044844591805, "observations": 1 }, "variables": [{ "label": "X Variable 1", "coefficients": [-0.20628158982515943], "standardError": 0.08731014539207609, "tStat": -2.3626302407220674 }, { "label": "X Variable 2", "coefficients": [0.5987301721162606], "standardError": 0.12416150926563964, "tStat": 4.822188258321637 }, { "label": "X Variable 3", "coefficients": [0.7351437498019004], "standardError": 0.07154733424292914, "tStat": 10.274928585121298 }, { "label": "Intercept", "coefficients": [-0.05163026454991204], "standardError": 0.06950154171021325, "tStat": -0.7428650254289967 }] } }, "modelColumns": [2, 4, 7, 1] } : null;
}

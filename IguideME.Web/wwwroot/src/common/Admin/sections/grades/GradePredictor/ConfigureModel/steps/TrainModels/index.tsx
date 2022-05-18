import React, { Component } from 'react';
import { Button, Col, Divider, Row, Spin } from "antd";
import { IProps } from "./types";
import { createCollectionKey, getRegistryCombinations, splitData, trainLinearModel } from "./helpers";
import { PredictiveModel } from "../../../../../../../../models/app/PredictiveModel";

export default class TrainModels extends Component<IProps> {

    state = {
        isTraining: false
    }

    _getValueFromData = (key: string, row: any) => {
        const column = row[key];
        if (!column)
            return NaN;

        if (typeof column == 'number')
            return column;

        return parseFloat(column.replace(/,/, '.'));
    }

    trainModels = () => {
        this.setState({ isTraining: true }, async () => {
            setTimeout(async () => {
                const { registry, rows } = this.props;
                let combinations = getRegistryCombinations(registry);
                console.log("COMBINATIONS", combinations);
                console.log("registry", registry);
                let models: PredictiveModel[] = [];

                for (const combination of combinations) {
                    // last column is the y output....
                    const trainData = rows.map(row =>
                        [...combination.map(c => this._getValueFromData(c.source_key, row)),
                        this._getValueFromData('final_grade', row)
                        ]
                    ).filter(row => row.every(x => !Number.isNaN(x)));

                    const [xTrain, xTest, yTrain, yTest] = splitData(trainData);

                    await trainLinearModel(xTrain, yTrain, xTest, yTest).then(({ model, mse }) => {

                        const predModel: PredictiveModel = {
                            id: -1,
                            course_id: -1,
                            entry_collection: createCollectionKey(combination),
                            mse,
                            theta: [
                                ...combination.map((c, i) => ({
                                    tile_id: c.tile_id,
                                    entry_id: c.entry_id,
                                    intercept: false,
                                    meta_key: c.meta_key,
                                    value: model.weights[i][0]
                                })),
                                {
                                    tile_id: null,
                                    entry_id: null,
                                    intercept: true,
                                    meta_key: "grade",
                                    value: model.weights[model.weights.length - 1][0]
                                }
                            ]
                        }
                        models.push(predModel);
                    });
                }

                this.props.setModels(models);
            }, 200);
        });
    }

    render(): React.ReactNode {
        const { isTraining } = this.state;
        return (
            <div id={"trainModels"}>
                <h2>Step 3. Training the models</h2>

                <Divider />

                <Row gutter={[10, 10]}>
                    <Col xs={24}>
                        {isTraining &&
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <Spin />
                                <h3>Training models...</h3>
                            </div>
                        }

                        {!isTraining &&
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
                                    Start Training
                                </Button>
                            </div>
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}

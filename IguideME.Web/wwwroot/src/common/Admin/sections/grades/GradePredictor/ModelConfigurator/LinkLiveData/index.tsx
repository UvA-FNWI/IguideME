import React, { Component } from "react"
import { Row, Col, Select, Divider } from "antd"

import TileController from "../../../../../../../api/controllers/tile";
import { Tile } from "../../../../../../../models/app/Tile";

import { GradesDatasets } from "../../types"
import { IStep } from "../interfaces"
import { Mock } from "../../../../../../../mock"

const { Option } = Select

interface IProps {
    gradesDatasets: GradesDatasets,
}

interface IState {
    tiles: Tile[]
}

export default class LinkLiveData extends Component<IProps, IState> implements IStep {
    mock = new LinkLiveDataMock(/* enable? */ true)

    state = {
        tiles: []
    }

    componentDidMount() {
        TileController.getTiles().then(async tiles => {
            tiles = tiles.filter(t => t.content == "ENTRIES")
            this.setState({ tiles: tiles })
            console.log(tiles)
        });
    }

    validate(): boolean {
        return true
    }

    isStepCompleted = this.validate

    render(): React.ReactNode {
        return (
            <Row>
                <Col xs={24} md={14}>
                    <h2>Link the uploaded grades to tiles (live data sources)</h2>

                    <Divider />

                    {Object.keys(this.props.gradesDatasets).map(datasetName =>
                        <Row>
                            <Col xs={24} md={24}>
                                <h3>{datasetName}</h3>
                            </Col>
                            <Col xs={24} md={24}>
                                <Select
                                    size="middle"
                                    placeholder="Choose a data source">
                                    {this.state.tiles.map((tile: Tile) =>
                                        <Option key={tile.id} value={tile.title}>
                                            {tile.title}
                                        </Option>
                                    )}
                                </Select>
                            </Col>
                        </Row>
                    )}
                </Col>

                <Col xs={24} md={10}>
                    <Row>
                        {/* TODO using "." as a margin/padding, fix this with css */}
                        <h2>.</h2>

                        <Divider />

                        <Col xs={24} md={24}>
                            <p>This configuration screen lets you train a model that once trained, will be able to roughly predict a student's final grade. The model should be trained on the results of a past academic year.
                    </p>
                            <p>Please provide this data through one .csv file per graded assignment (e.g. mini-test, quiz, etc.); The files must contain the following two columns: "studentID" and "grade". Furthermore, please take note of which file contains the final grades.</p>
                            <p>You can select multiple files at once.</p>

                        </Col>
                    </Row>
                </Col>
            </Row >
        )
    }
}

export class LinkLiveDataMock extends Mock {
}

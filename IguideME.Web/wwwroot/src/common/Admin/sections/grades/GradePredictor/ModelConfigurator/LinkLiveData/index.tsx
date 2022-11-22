import "./style.scss";

import React, { Component } from "react";
import { Alert, Row, Col, Select, Divider } from "antd";

import TileController from "../../../../../../../api/controllers/tile";
import { Tile } from "../../../../../../../models/app/Tile";

import { GradesDatasets } from "../../types";
import { IStep } from "../interfaces";
import { LinkLiveDataMock } from "../mocking";

const { Option } = Select;

interface IProps {
  gradesDatasets: GradesDatasets;
  finalGradesDatasetName: string;

  parentSetGradesDatasetTilePairs: Function;
}

interface IState {
  tiles: Tile[];
  gradesDatasetTilePairs: { [name: string]: number };
  inputError: boolean;
}

export default class LinkLiveData
  extends Component<IProps, IState>
  implements IStep
{
  mock = new LinkLiveDataMock(/* enable? */ true);

  state = {
    tiles: [],
    gradesDatasetTilePairs: this.mock.gradesDatasetTilePairs,
    inputError: false,
  };

  componentDidMount() {
    TileController.getTiles().then(async (tiles) => {
      tiles = tiles.filter((t) => t.content === "ENTRIES");
      this.setState({ tiles: tiles });
    });
  }

  validate(): boolean {
    let { gradesDatasets }: IProps = this.props;
    let { gradesDatasetTilePairs }: IState = this.state;

    let wValid = true;
    if (
      Object.keys(gradesDatasetTilePairs).length !==
      Object.keys(gradesDatasets).length - 1
    ) {
      wValid = false;
      this.setState({ inputError: true });
    }
    return wValid;
  }

  isStepCompleted = this.validate;

  render(): React.ReactNode {
    return (
      <div>
        <Row>
          <Col xs={24} md={24}>
            <h2>Link the uploaded grades to tiles (live data sources)</h2>

            <Divider />
          </Col>
        </Row>

        <Row>
          <Col xs={24} md={14}>
            {this.state.inputError && (
              <Alert
                message="Not all fields have been filled"
                description="Please assign a live data source to every uploaded dataset."
                type="error"
              />
            )}

            {Object.keys(this.props.gradesDatasets)
              .filter(
                (databaseName) =>
                  databaseName !== this.props.finalGradesDatasetName
              )
              .map((datasetName) => (
                <Row key={datasetName} className="select-container">
                  <Col xs={24} md={24}>
                    <h3 className="select-title">{datasetName}</h3>
                  </Col>
                  <Col xs={24} md={24}>
                    <Select
                      size="middle"
                      placeholder="Choose a data source"
                      onChange={(_, o) => {
                        // because typescript is a horrible, horrible language right now
                        // and I just want access to the key property of o
                        // and save it as an integer.
                        const _o: { key: number } | any = o;
                        const v: number = +_o.key;

                        let { gradesDatasetTilePairs }: IState = this.state;
                        gradesDatasetTilePairs[datasetName] = v;
                        this.setState({
                          gradesDatasetTilePairs: gradesDatasetTilePairs,
                        });

                        console.log(JSON.stringify(gradesDatasetTilePairs));

                        let { parentSetGradesDatasetTilePairs } = this.props;
                        parentSetGradesDatasetTilePairs(gradesDatasetTilePairs);
                      }}
                    >
                      {this.state.tiles.map((tile: Tile) => (
                        <Option key={tile.id} value={tile.title}>
                          {tile.title}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                </Row>
              ))}
          </Col>

          <Col xs={24} md={10}>
            <Row>
              <Col xs={24} md={24}>
                <p>
                  This configuration screen lets you train a model that once
                  trained, will be able to roughly predict a student's final
                  grade. The model should be trained on the results of a past
                  academic year.
                </p>
                <p>
                  Please provide this data through one .csv file per graded
                  assignment (e.g. mini-test, quiz, etc.); The files must
                  contain the following two columns: "studentID" and "grade".
                  Furthermore, please take note of which file contains the final
                  grades.
                </p>
                <p>You can select multiple files at once.</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

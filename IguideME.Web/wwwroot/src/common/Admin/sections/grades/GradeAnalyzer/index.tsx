import React, { Component } from "react";
import Admin from "../../../index";
import {Divider, Row, Col, Statistic, Tabs} from "antd";
import GradeScatter from "../../../../../components/visuals/GradeScatter";
import EntrySelect from "./EntrySelect";
import GradeBar from "../../../../../components/visuals/GradesOverviewBar";
import { IProps, IState } from "./types";
import TileController from "../../../../../api/controllers/tile";
import {mergeData} from "./helpers";
import {TileEntry, TileEntrySubmission} from "../../../../../models/app/Tile";

const compute = require( 'compute.io' );

export default class GradeAnalyzer extends Component<IProps, IState> {

  state = {
    tiles: [],
    entryOne: undefined, entryTwo: undefined,
    allSubmissions: [], submissionsOne: [], submissionsTwo: [], allEntries: []
  }

  componentDidMount(): void {
    TileController.getTiles().then(async tiles => {
      let allEntries: TileEntry[] = [];

      for (const tile of tiles) {
        await TileController.getTileEntries(tile.id).then(entries => allEntries.push(...entries));
      }

      TileController.getAllSubmissions().then(allSubmissions =>
        this.setState({ allSubmissions, allEntries, tiles })
      );
    });
  }

  update = () => {
    const { entryOne, entryTwo } = this.state;

    if (!entryOne || !entryTwo) {
      return;
    }

    TileController.getEntrySubmissions(entryOne!).then((submissionsOne) => {
      TileController.getEntrySubmissions(entryTwo!).then((submissionsTwo) => {
        this.setState({ submissionsOne, submissionsTwo });
      });
    });
  }

  render(): React.ReactNode {
    const {
      entryOne,
      entryTwo,
      submissionsOne,
      submissionsTwo,
      allSubmissions,
      allEntries,
      tiles
    }: IState = this.state;
    void allSubmissions; // discard value

    const data = mergeData(submissionsOne, submissionsTwo);

    return (
      <Admin menuKey={"gradeAnalyzer"}>
        <h1>Grade Analyzer</h1>
        <Divider />

        <EntrySelect
          setEntryOne={(id) => this.setState({ entryOne: id }, () => this.update())}
          setEntryTwo={(id) => this.setState({ entryTwo: id }, () => this.update())}
          tiles={tiles}
          entries={allEntries}
        />

        <Divider />

        { (data.length > 0) ?
          <Row gutter={[50, 10]}>
            <Col xs={24} md={24}>
              <div className={"primaryContainer"}>
                <Row>
                  <Col xs={24}>
                    <Row gutter={10}>
                      <Col>
                        <Statistic
                          title={"Correlation"}
                          value={Math.round(compute.pcorr(
                            data.map(d => parseFloat(d.grade1)),
                            data.map(d => parseFloat(d.grade2))
                          )[0][1] * 1000) / 1000}
                        />
                      </Col>
                      <Col>
                        <Statistic
                          title={"Chi-square dist."}
                          value={compute.chi}
                        />
                      </Col>
                      <Col>
                        <Statistic
                          title={"Sample size"}
                          value={data.length}
                        />
                      </Col>
                    </Row>
                  </Col>

                  <Col xs={24}>
                    <Tabs type="card">
                      <Tabs.TabPane tab={"Grade correlation"} key="1">
                        <GradeScatter mergedData={data} />
                      </Tabs.TabPane>
                      <Tabs.TabPane tab={"Statistics"} key="2">
                        <Row gutter={[50, 10]}>
                          <Col xs={24} md={12}>
                            <GradeBar binary={false}
                                      title={allEntries.find(e => e.id === entryOne)?.title || ""}
                                      grades={submissionsOne.map((s: TileEntrySubmission) => parseFloat(s.grade))} />
                          </Col>

                          <Col xs={24} md={12}>
                            <GradeBar binary={false}
                                      title={allEntries.find(e => e.id === entryTwo)?.title || ""}
                                      grades={submissionsTwo.map((s: TileEntrySubmission) => parseFloat(s.grade))} />
                          </Col>
                        </Row>
                      </Tabs.TabPane>
                    </Tabs>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row> : <span>Waiting for selection</span>
        }
      </Admin>
    )
  }
}
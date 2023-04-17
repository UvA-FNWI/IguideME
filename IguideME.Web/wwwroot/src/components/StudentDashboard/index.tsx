import React, { Component } from "react";
import {IProps, IState, TilesGradeSummary, ViewTypes} from "./types";
import TileGroup from "./TileGroup";
import {Tile, TileEntrySubmission, TileGroup as TileGroupModel} from "../../models/app/Tile";
import FadeIn from "react-fade-in";
import TileController from "../../api/controllers/tile";
import Loading from "../utils/Loading";
import {DashboardColumn} from "../../models/app/Layout";
import TileDetail from "./TileDetail";
import { Col, Radio, Row } from "antd";
import { AppstoreOutlined, BarChartOutlined } from "@ant-design/icons";
// import TileRadar from "./TileRadar";
import TileBars from "./TileBars";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../store";
import "./style.scss";
import {DataMartActions} from "../../store/actions/datamart";
import {PredictedGrade} from "../../models/app/PredictiveModel";
import UserProfile from "./UserProfile";
import {CanvasDiscussion} from "../../models/canvas/Discussion";
import {LearningOutcome} from "../../models/app/LearningGoal";
import DataMartController from "../../api/controllers/datamart";
import AppController from "../../api/controllers/app";
import UserSettings from "../../common/UserSettings";
import { HistoricTileGrades } from "./TileHistoricGraph/types";

const mapState = (state: RootState) => ({
  dashboardColumns: state.dashboardColumns,
  tiles: state.tiles.filter((t: Tile) => t.visible),
  tileGroups: state.tileGroups,
  tileEntries: state.tileEntries,
  predictions: state.predictions,
});

const mapDispatch = {
  loadPredictions: (user: string = 'self') => DataMartActions.loadPredictions(user)
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & IProps;

class StudentDashboard extends Component<Props, IState> {

  state = {
    tilesGradeSummary: [],
    peerGrades: [],
    userSubmissions: new Map<number, TileEntrySubmission[]>(),
    loaded: true,
    displayTile: null,
    discussions: [] as CanvasDiscussion[],
    learningOutcomes: [] as LearningOutcome[],
    viewType: "bar" as ViewTypes,
    predictions: [],
    goalGrade: 0,
    settings_view: false,
    historicGrades: new Map<number, HistoricTileGrades>()
  }

  componentDidMount(): void {
    AppController.trackAction("Load home")

    if (this.props.consent !== null && this.props.consent !== undefined) {
      AppController.trackAction("No consent")
      this.setState({settings_view: true});
    }
    window.addEventListener('selectTile', (event: any) => {
      this.setState({ displayTile: event?.detail});
    });

    this.setup(this.props);

    // This should never be possible, just for if something goes wrong.
    if (this.state.goalGrade === -1) {
      AppController.trackAction("No goal grade")
      this.setState({settings_view: true});
    }
  }

  componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
    if (nextProps.student && nextProps.student?.userID !== this.props.student?.userID) {
        this.setup(nextProps);
    }
  }

  setSettingsView = (view: boolean) => {
    this.setState({settings_view: view});
  }

  setTileView = (view: any) => {
    AppController.trackAction(`Change view to ${view}`)
    this.setState({ viewType: view })
  }

  setup = async (props: Props, propPredictions: PredictedGrade[] = []) => {
    let { tiles, student} = props;
    if (!student) return;

    // if (propPredictions.length >= 0) predictions = propPredictions;

    let predictions = await DataMartController.getPredictions(student.userID);

    this.setState({ loaded: false });

    let submissions = new Map<number, TileEntrySubmission[]>();

    let p_discussions: Promise<CanvasDiscussion[]>[] = [];
    let p_goals: Promise<LearningOutcome[]>[] = [];

    let data = [];
    let grade;

    for (const tile of tiles) {
      if (tile.content === "LEARNING_OUTCOMES") {
        p_goals.push(TileController.getUserGoals(tile.id, student.userID));
        continue;
      }
      if (tile.type === "DISCUSSIONS") {
        p_discussions.push(TileController.getDiscussions(tile.id, student.userID));
        continue;
      }

      if (tile.content === "PREDICTION") {
        data.push({
          tile: tile,
          average: predictions.length > 0 ? predictions[0].grade : 0
        })
        continue;
      }

      submissions.set(tile.id, await TileController.getTileSubmissions(tile.id, student.userID));

      let avg = 0, total = 0;

      for (const sub of submissions.get(tile.id)!) {
        grade = parseFloat(sub.grade);
        avg += (tile.content === "BINARY") ? Number(grade !== 0) : grade;
        total++;
      }

      avg = total ? avg/total : avg;
      data.push({ tile: tile, average: avg}
      );
    }

    let discussions = (await Promise.all(p_discussions)).flat();
    let goals = (await Promise.all(p_goals)).flat();

    let goalGrade = await AppController.getGoalGrade(student.userID);
    let historicGrades = await TileController.getHistory(student.userID);
    console.log(historicGrades)

    this.setState({
      discussions,
      learningOutcomes: goals,
      tilesGradeSummary: data,
      userSubmissions: submissions,
      predictions: predictions,
      goalGrade: goalGrade,
      historicGrades: historicGrades
    }, () => {
      TileController.getPeerResults(student!.userID).then(peerGrades =>
        this.setState({ peerGrades, loaded: true })
      ).catch(() => this.setState({ loaded: true }));
    });
  }

  render(): React.ReactNode {
    const {
      loaded,
      displayTile,
      viewType,
      tilesGradeSummary,
      peerGrades,
      userSubmissions,
      discussions,
      learningOutcomes,
      predictions,
      goalGrade,
      settings_view,
      historicGrades
    } = this.state;

    let mappedHistoricGrades = new Map(Object.entries(historicGrades));

    const { tiles, tileGroups, dashboardColumns, tileEntries, student} = this.props;

    if (!loaded || !student) return (<Loading small={true} />);

    if (settings_view) {
      return <UserSettings consent= {this.props.consent} settings={this.setSettingsView} />
    }

    if (displayTile) {

      var tileHistory: HistoricTileGrades;
      let currentTileHistory = mappedHistoricGrades.get((displayTile as any).tile.id.toString());
      if (currentTileHistory !== undefined)
      {
        tileHistory = {
          dates: Object.values(currentTileHistory)[0] as Array<string>,
          user_avg: Object.values(currentTileHistory)[1] as Array<number>,
          peer_avg: Object.values(currentTileHistory)[2] as Array<number>,
          peer_max: Object.values(currentTileHistory)[3] as Array<number>,
          peer_min: Object.values(currentTileHistory)[4] as Array<number> };
      }

      return <TileDetail tile={(displayTile as any).tile}
                         tileEntries={tileEntries}
                         discussions={discussions}
                         predictions={predictions}
                         submissions={userSubmissions.get((displayTile as any).tile.id)!}
                         learningOutcomes={learningOutcomes}
                         student={student}
                         historicGrades={tileHistory!}
      />
    }

    return (
      <div id={"studentDashboard"}>
        <Row justify={"space-between"}>
        <Col>

        <Radio.Group value={viewType}
                     buttonStyle="solid"
                     onChange={e => this.setTileView(e.target.value)}
                     >
          <Radio.Button value="bar"><BarChartOutlined /> Bar</Radio.Button>
          <Radio.Button value="grid"><AppstoreOutlined /> Grid</Radio.Button>
        </Radio.Group>
        </Col>
        <Col >
          <div style={{margin: 10}}>
              Goal Grade: { goalGrade }
          </div>
        </Col>
        </Row>

        { viewType === "grid" ?
          <FadeIn>
            <div>
              { dashboardColumns.map((c: DashboardColumn) => {
                return (
                  <div className={`column ${c.container_width}`}
                       key={c.id}>
                    { tileGroups
                      .filter((tg: TileGroupModel) => tg.column_id === c.id)
                      .sort((a: TileGroupModel, b: TileGroupModel) => a.position - b.position)
                      .map((tg: TileGroupModel) =>
                        <TileGroup tileGroup={tg}
                                   tiles={tiles.filter((t: Tile) => t.group_id === tg.id) }
                                   discussions={discussions}
                                   tileEntries={tileEntries.filter(e => tiles.filter(
                                     (t: Tile) => t.group_id === tg.id).map(x => x.id).includes(e.tile_id))}
                                   student={student}
                                   tilesGradeSummary={tilesGradeSummary.filter(
                                     (tgs: TilesGradeSummary) => tgs.tile.group_id === tg.id)}
                                   peerGrades={peerGrades}
                                   submissions={userSubmissions}
                                   learningOutcomes={learningOutcomes}
                        key={tg.id}
                        />
                      )
                    }
                  </div>
                )
              })}
            </div>
          </FadeIn>
          :
          <Row justify={'center'}>
            <TileBars tiles={tiles}
                      tilesGradeSummary = {tilesGradeSummary}
                      peerGrades = {peerGrades}
                      discussions = {discussions}
                      learningOutcomes={learningOutcomes}
                      student={student}
            />
          </Row>
        }
      <br />
      <br />
        <UserProfile student={this.props.student}
                     settings={this.setSettingsView} />
      </div>
    )
  }
}

export default connector(StudentDashboard);

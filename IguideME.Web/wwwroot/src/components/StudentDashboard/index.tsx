import React, { Component } from "react";
import {IProps, IState, PeerGrades, TilesGradeSummary, ViewTypes} from "./types";
import TileGroup from "./TileGroup";
import {Tile, TileGroup as TileGroupModel} from "../../models/app/Tile";
import FadeIn from "react-fade-in";
import TileController from "../../api/controllers/tile";
import Loading from "../utils/Loading";
import {DashboardColumn} from "../../models/app/Layout";
import TileDetail from "./TileDetail";
import { Radio } from "antd";
import { AppstoreOutlined, RadarChartOutlined } from "@ant-design/icons";
import TileRadar from "./TileRadar";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../store";
import "./style.scss";
import {DataMartActions} from "../../store/actions/datamart";
import {PredictedGrade} from "../../models/app/PredictiveModel";
import UserProfile from "./UserProfile";
import {CanvasDiscussion} from "../../models/canvas/Discussion";
import {LearningGoal, LearningOutcome} from "../../models/app/LearningGoal";

const compute = require('compute.io');

const mapState = (state: RootState) => ({
  dashboardColumns: state.dashboardColumns,
  tiles: state.tiles,
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
    userSubmissions: [],
    loaded: true,
    displayTile: undefined,
    discussions: [],
    learningOutcomes: [],
    viewType: "radar" as ViewTypes
  }

  componentDidMount(): void {
    window.addEventListener('selectTile', (event: any) => {
      if (event.detail) {
        const tile: Tile | undefined = (event as any).detail;
        this.setState({ displayTile: tile });
      } else this.setState({ displayTile: undefined });
    });

    this.setup(this.props);
  }

  componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
    if (nextProps.student?.login_id !== this.props.student?.login_id && nextProps.student) {
      this.props.loadPredictions(nextProps.student.login_id).then(({ payload }) => {
        this.setup(nextProps, payload);
      });
    }

    if (nextProps.predictions.length !== this.props.predictions.length) {
      this.setup(nextProps);
    }
  }

  setup = async (props: Props, propPredictions: PredictedGrade[] = []) => {
    const { tiles, student, tileEntries, predictions } = props;
    if (!student) return;

    this.setState({ loaded: false });

    let discussions: CanvasDiscussion[] = [];
    let goals: LearningOutcome[] = [];

    for (const tile of tiles.filter(t => t.type === "DISCUSSIONS")) {
      const discussion_result: CanvasDiscussion[] =
        await TileController.getDiscussions(tile.id, student.login_id).then(d => d);
      discussions.push(...discussion_result);
    }

    for (const tile of tiles.filter(t => t.content === "LEARNING_OUTCOMES")) {
      const goal_result: any =
        await TileController.getUserGoals(tile.id, student.login_id).then(g => g);

      goals.push(...goal_result);
    }

    TileController.getSubmissions(student.login_id).then(userSubmissions => {
      let data = tiles.filter(
        t => t.content !== "PREDICTION" && t.content !== "LEARNING_OUTCOMES" &&
          t.type !== "DISCUSSIONS"
      ).map(t => {
        return {
          tile: t,
          average: t.content.toLowerCase() === 'binary' ?
            (
              userSubmissions.filter(
                s => tileEntries
                  .filter(e => e.tile_id === t.id && parseFloat(s.grade) > .1)
                  .map(e => e.id)
                  .includes(s.entry_id)
              ).length /
              userSubmissions.filter(
                s => tileEntries
                  .filter(e => e.tile_id === t.id)
                  .map(e => e.id)
                  .includes(s.entry_id)
              ).length
            ) * 100 :
            compute.mean(
              userSubmissions.filter(
                s => tileEntries
                  .filter(e => e.tile_id === t.id)
                  .map(e => e.id)
                  .includes(s.entry_id)
              ).map(s => parseFloat(s.grade))
            )
        }
      });

      if (tiles.filter(t => t.content === "PREDICTION").length > 0)
      {
        const sortedPredictions = (propPredictions.length > 0 ? propPredictions : predictions).sort(
          (a, b) => b.graded_components - a.graded_components);
        data.push({
          tile: tiles.find(t => t.content == "PREDICTION")!,
          average: sortedPredictions.length > 0 ? sortedPredictions[0].grade : 0
        });
      }

      this.setState({
        discussions,
        learningOutcomes: goals,
        tilesGradeSummary: data,
        userSubmissions
      }, () => {
        TileController.getPeerResults(student.login_id).then(peerGrades =>
          this.setState({ peerGrades, loaded: true })
        ).catch(() => this.setState({ loaded: true }));
      });
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
      learningOutcomes
    } = this.state;

    const { tiles, tileGroups, dashboardColumns, tileEntries, student, predictions } = this.props;
    if (!loaded || !student) return (<Loading small={true} />);

    if (displayTile) {
      return <TileDetail tile={(displayTile as any).tile}
                         tileEntries={tileEntries}
                         discussions={discussions}
                         predictions={predictions}
                         submissions={userSubmissions}
                         learningOutcomes={learningOutcomes}
      />
    }

    return (
      <div id={"studentDashboard"}>
        <Radio.Group value={viewType}
                     buttonStyle="solid"
                     onChange={e => this.setState({ viewType: e.target.value })}
        >
          <Radio.Button value="radar"><RadarChartOutlined /> Radar</Radio.Button>
          <Radio.Button value="grid"><AppstoreOutlined /> Grid</Radio.Button>
        </Radio.Group>

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
                                   tiles={tiles.filter((t: Tile) => t.group_id === tg.id)}
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
          </FadeIn> :
          <TileRadar tiles={tiles}
                     tileEntries={tileEntries}
                     student={student}
                     tilesGradeSummary={tilesGradeSummary}
                     peerGrades={peerGrades}
          />
        }

        <UserProfile student={this.props.student} />
      </div>
    )
  }
}

export default connector(StudentDashboard);

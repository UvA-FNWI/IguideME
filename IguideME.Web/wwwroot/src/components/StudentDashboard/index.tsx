import React, { Component } from "react";
import {IProps, IState, TilesGradeSummary, ViewTypes} from "./types";
import TileGroup from "./TileGroup";
import {Tile, TileEntrySubmission, TileGroup as TileGroupModel} from "../../models/app/Tile";
import FadeIn from "react-fade-in";
import TileController from "../../api/controllers/tile";
import Loading from "../utils/Loading";
import {DashboardColumn} from "../../models/app/Layout";
import TileDetail from "./TileDetail";
import { Radio } from "antd";
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
    viewType: "bar" as ViewTypes
  }

  componentDidMount(): void {
    window.addEventListener('selectTile', (event: any) => {
      this.setState({ displayTile: event?.detail});
    });

    this.setup(this.props);
  }

  componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
    if (nextProps.student && nextProps.student?.login_id !== this.props.student?.login_id) {
      this.props.loadPredictions(nextProps.student.login_id).then(({ payload }) => {
        this.setup(nextProps, payload);
      });
    }

    if (nextProps.predictions.length !== this.props.predictions.length) {
      this.setup(nextProps);
    }
  }

  setup = async (props: Props, propPredictions: PredictedGrade[] = []) => {
    let { tiles, student, predictions } = props;
    if (!student) return;

    if (propPredictions.length >= 0) predictions = propPredictions;

    this.setState({ loaded: false });

    let submissions = new Map<number, TileEntrySubmission[]>();


    const sortedPredictions = predictions.sort(
      (a, b) => b.graded_components - a.graded_components);

    let p_discussions: Promise<CanvasDiscussion[]>[] = [];
    let p_goals: Promise<LearningOutcome[]>[] = [];

    let data = [];
    let grade;

    for (const tile of tiles) {
      if (tile.content === "LEARNING_OUTCOMES") {
        p_goals.push(TileController.getUserGoals(tile.id, student.login_id));
        continue;
      }
      if (tile.type === "DISCUSSIONS") {
        p_discussions.push(TileController.getDiscussions(tile.id, student.login_id));
        continue;
      }

      if (tile.content === "PREDICTION") {
        data.push({
          tile: tile,
          average: sortedPredictions.length > 0 ? sortedPredictions[0].grade : 0
        })
        continue;
      }

      submissions.set(tile.id, await TileController.getTileSubmissions(tile.id, student.login_id));

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

    this.setState({
      discussions,
      learningOutcomes: goals,
      tilesGradeSummary: data,
      userSubmissions: submissions
    }, () => {
      TileController.getPeerResults(student!.login_id).then(peerGrades =>
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
      learningOutcomes
    } = this.state;

    const { tiles, tileGroups, dashboardColumns, tileEntries, student, predictions } = this.props;
    console.log("tiles", tiles);
    console.log("Predictions", predictions);

    if (!loaded || !student) return (<Loading small={true} />);

    if (displayTile) {
      return <TileDetail tile={(displayTile as any).tile}
                         tileEntries={tileEntries}
                         discussions={discussions}
                         predictions={predictions}
                         submissions={userSubmissions.get((displayTile as any).tile.id)!}
                         learningOutcomes={learningOutcomes}
      />
    }

    return (
      <div id={"studentDashboard"}>
        <Radio.Group value={viewType}
                     buttonStyle="solid"
                     onChange={e => this.setState({ viewType: e.target.value })}
        >
          <Radio.Button value="bar"><BarChartOutlined /> Bar</Radio.Button>
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
          // <TileRadar tiles={tiles}
          //            tileEntries={tileEntries}
          //            student={student}
          //            tilesGradeSummary={tilesGradeSummary}
          //            peerGrades={peerGrades}
          // />
          <div style={{ padding: '0 8%'}}>
            <TileBars tiles={tiles}
                      tilesGradeSummary = {tilesGradeSummary}
                      peerGrades = {peerGrades}
                      discussions = {discussions}
                      learningOutcomes={learningOutcomes}
            />
          </div>
        }

        <UserProfile student={this.props.student} />
      </div>
    )
  }
}

export default connector(StudentDashboard);

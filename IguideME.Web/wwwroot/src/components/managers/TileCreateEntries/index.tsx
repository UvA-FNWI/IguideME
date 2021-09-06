import React, { Component } from 'react';
import {IProps, IState} from "./types";
import ExternalDataManager from "./ExternalDataManager";
import CreationPreview from "./CreationPreview";
import AssignmentManager from "./AssignmentManager";
import TileController from "../../../api/controllers/tile";
import {Tile, TileEntry} from "../../../models/app/Tile";
import {RootState} from "../../../store";
import {connect, ConnectedProps} from "react-redux";
import Loading from "../../utils/Loading";
import DiscussionManager from "./DiscussionManager";
import {message} from "antd";
import LearningGoalsManager from "./LearningGoalsManager";
import "./style.scss";

const mapState = (state: RootState) => ({
  assignments: state.assignments,
  discussions: state.discussions
});

const connector = connect(mapState)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = IProps & PropsFromRedux;

class TileCreateEntries extends Component<Props, IState> {

  state = {
    activeGoals: [],
    activeEntries: [],
    loading: false
  }

  componentDidMount(): void {
    if (this.props.tile) {
      this.setState({loading: true}, () => {
        this._initializeTile(this.props.tile!);
      });
    }
  }

  componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
    if (
          (nextProps.tile?.id !== this.props.tile?.id) ||
          (nextProps.contentType !== this.props.contentType) ||
          (nextProps.tileType !== this.props.tileType)
        ) {
      if (nextProps.tile) this._initializeTile(nextProps.tile);
      else this.setState({ activeEntries: [], activeGoals: [] });
    }
  }

  _initializeTile = (tile: Tile) => {
    if (tile.content === "LEARNING_OUTCOMES") {
      TileController.getTileGoals(tile.id).then(goals => {
        this.setState({ activeGoals: goals, loading: false }, () => {
          this.props.updateGoals(goals);
        });
      });
    } else {
      TileController.getTileEntries(tile.id).then(entries => {
        this.setState({ activeEntries: entries, loading: false }, () => {
          this.props.updateEntries(entries);
        });
      });
    }
  }

  addEntry = (entryRegistry: TileEntry) => {
    if (this.state.activeEntries.find((x: TileEntry) => x.title === entryRegistry.title)) {
      message.error("Entry is already registered!")
      return;
    }

    this.setState(
      { activeEntries: [...this.state.activeEntries, entryRegistry] },
      () => {
        this.props.updateEntries(this.state.activeEntries);
      }
    );
  }

  removeEntry = (entryRegistry: TileEntry) => {
    if (!this.state.activeEntries.find((x: TileEntry) => x.title === entryRegistry.title)) {
      message.error("Entry does not exist!")
      return;
    }

    this.setState(
      { activeEntries: this.state.activeEntries.filter((e: TileEntry) =>
          e.title !== entryRegistry.title)
      }, () => {
        this.props.updateEntries(this.state.activeEntries);
      }
    );
  }

  render(): React.ReactNode {
    const { activeEntries, loading, activeGoals }: IState = this.state;
    const { tile, contentType, tileType, graphView, setGraphView } = this.props;

    if (loading) return <Loading small={true} />

    if (contentType && (contentType === "LEARNING_OUTCOMES")) {
      return <LearningGoalsManager tile={tile}
                                   setGoals={goals => {
                                     this.setState({ activeGoals: goals });
                                     this.props.updateGoals(goals)
                                   }}
                                   goals={activeGoals} />
    } else if (contentType && (contentType === "PREDICTION")) {

    } else if (contentType && !tileType) {
      return (<CreationPreview contentType={contentType} />);
    }

    if (!contentType || !tileType) return null;

    switch (tileType!) {
      case "ASSIGNMENTS":
        return (<AssignmentManager tile={tile}
                                   addEntry={this.addEntry}
                                   removeEntry={this.removeEntry}
                                   graphView={graphView}
                                   setGraphView={setGraphView}
                                   activeAssignments={activeEntries}
                                   canvasAssignments={this.props.assignments} />);
      case "DISCUSSIONS":
        return (<DiscussionManager tile={tile}
                                   addEntry={this.addEntry}
                                   removeEntry={this.removeEntry}
                                   wildcard={this.props.wildcard}
                                   setWildcard={this.props.setWildcard}
                                   activeDiscussions={activeEntries}
                                   canvasDiscussions={this.props.discussions} />);
      case "EXTERNAL_DATA":
        return (<ExternalDataManager />);
      default:
        return null;
    }
  }
}

export default connector(TileCreateEntries);
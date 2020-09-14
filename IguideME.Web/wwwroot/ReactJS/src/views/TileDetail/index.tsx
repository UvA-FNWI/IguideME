import React, { PureComponent } from "react";
import {fetchTiles} from "../../store/actions/tiles";
import {RootState} from "../../store";
import {ITile} from "../../models/ITile";
import {connect} from "react-redux";
import TileList from "../TileList";
import {setView} from "../../store/actions/view";
import Tooltip from "antd/lib/tooltip";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import GraphView from "./GraphView";
import ComponentsView from "./ComponentsView";
import "./tile-detail.scss";
import OutcomeView from "./OutcomeView";

const mapStateToProps = (state: RootState) => {
  return {
    view: state.view
  };
}

type IProps = {
  dispatch: (e: any) => {},
  view: ITile | null,
}

class TileDetail extends PureComponent<IProps> {
  componentDidMount(): void {
    //fetchTiles
    const { dispatch } = this.props;
    dispatch(fetchTiles());
  }

  renderGraph = () => {
    const { view } = this.props;

    if (!view || view.entries.length !== 1) {
      return (
        <span>Error: malformed data</span>
      )
    }

    const entry = view.entries[0].metadata;
    const last_entry = entry[entry.length - 1];

    return (
      <div className={"graphWrapper"}>
        <GraphView average={last_entry ? last_entry.y_hat : '??'} data={entry} />
      </div>
    );
  }

  renderComponents = () => {
    const { view } = this.props;

    if (!view || view.entries.length < 1) return null;

    return (
      <div className={"componentsWrapper"}>
        <ComponentsView entries={view.entries} />
      </div>
    )
  }

  renderDetailView = () => {
    const { view } = this.props;

    if (!view) return null;

    if (view.type === "outcome") {
      return <OutcomeView />;
    }

    switch(view.entry_view_type) {
      case "graph":
        return this.renderGraph();
      default:
        return this.renderComponents();
    }
  }

  render(): React.ReactNode {
    const { dispatch, view } = this.props;

    if (!view) return <TileList />

    return (
      <div id={"tileDetail"}>
        <Tooltip placement={"right"} title={"Back to dashboard"}>
          <Button
            onClick={async () => {
              dispatch(await setView(null))
            }}
            type={"primary"}
            shape={"circle"}
            icon={<LeftOutlined />}
          />
        </Tooltip>
        <h1>{ view.name }</h1>

        { this.renderDetailView() }
      </div>
    )
  }
}

export default connect(mapStateToProps)(TileDetail);


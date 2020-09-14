import React, { PureComponent } from "react";
import "./iguideme.scss";
import {RootState} from "../../store";
import {connect} from "react-redux";
import {ITile} from "../../models/ITile";
import TileList from "../../views/TileList";
import TileDetail from "../../views/TileDetail";

const mapStateToProps = (state: RootState) => {
  return {
    view: state.view
  };
}

type IProps = {
  dispatch: (e: any) => {},
  view: ITile | null,
}

class App extends PureComponent<IProps> {

  render(): React.ReactNode {

    const { view } = this.props;

    return (
      <div id={"app"}>
        { view === null ? <TileList /> : <TileDetail /> }
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
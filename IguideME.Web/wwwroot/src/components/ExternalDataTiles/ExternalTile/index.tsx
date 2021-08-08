import React, { Component } from "react";
import {IProps, IState} from "./types";
import {Button, Tag} from "antd";
import FadeIn from "react-fade-in";
import HistoricUploads from "./HistoricUploads";
import UploadManager from "../../upload/UploadManager";
import {RootState} from "../../../store";
import {TileEntrySubmission} from "../../../models/app/Tile";
import {TileActions} from "../../../store/actions/tiles";
import {connect, ConnectedProps} from "react-redux";
import TileController from "../../../api/controllers/tile";
import Loading from "../../utils/Loading";
import StudentController from "../../../api/controllers/student";

const mapState = (state: RootState) => ({
  tiles: state.tiles,
  tileEntries: state.tileEntries,
});

const mapDispatch = {
  loadTiles: () => TileActions.loadTiles(),
  loadTileEntries: () => TileActions.loadTileEntries(),
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & IProps;

class ExternalTile extends Component<Props, IState> {

  state = {
    loaded: false,
    uploadMenuOpen: false,
    students: [],
    submissions: []
  }

  componentDidMount() {
    this.reload();
  }

  reload = () => {
    this.setState({ loaded: false }, () => {
      StudentController.getStudents().then(async students => {
        const { id } = this.props.tile;
        const { tileEntries } = this.props;
        const filteredEntries = tileEntries.filter(e => e.tile_id === id);
        let tileSubmissions: TileEntrySubmission[] = [];

        for (const entry of filteredEntries) {
          const entrySubmissions = await TileController.getEntrySubmissions(entry.id).then(v => v);
          tileSubmissions.push(...entrySubmissions);
        }

        this.props.loadTiles().then(() => {
          this.props.loadTileEntries().then(() => {
            this.setState({ submissions: tileSubmissions, loaded: true, students });
          });
        });
      });
    });
  }

  render(): React.ReactNode {
    const { tileGroup, tile, tileEntries } = this.props;
    const { uploadMenuOpen, students, submissions, loaded } = this.state;

    if (!loaded) return <Loading />;

    return (
      <div className={"primaryContainer externalTile"} style={{marginBottom: 20}}>
        <h2><b>{ tile.title }</b> <Tag>{ tileGroup.title }</Tag></h2>

        { uploadMenuOpen ?
          <FadeIn>
            <UploadManager tile={tile}
                           reload={this.reload}
                           closeUploadMenu={() => this.setState({ uploadMenuOpen: false })}
            />
          </FadeIn> :
          <Button className={"successButton"}
                  style={{float: 'right'}}
                  onClick={() => this.setState({ uploadMenuOpen: true })}
          >
            New Upload
          </Button>
        }

        <HistoricUploads tile={tile}
                         entries={tileEntries.filter(e => e.tile_id === tile.id)}
                         students={students}
                         submissions={submissions}
                         reload={this.reload}
        />
      </div>
    )
  }
}

export default connector(ExternalTile);
import React, { PureComponent } from "react";
import {fetchTiles} from "../../store/actions/tiles";
import {Alert, Button, Col, Row, Spin, Typography} from "antd";
import Tile from "../../components/Tile";
import {RootState} from "../../store";
import {ITile} from "../../models/ITile";
import {connect} from "react-redux";
import AdminController from "../../api/admin";
import {IBackendResponse} from "../../models/IBackendResponse";
import {setAdminView} from "../../store/actions/adminView";
import {STATES} from "../../api/testStates";
import "./style.scss";

const mapStateToProps = (state: RootState) => {
  return {
    tiles: state.tiles,
  };
}

type IProps = {
  dispatch: (e: any) => {};
  tiles: ITile[] | null;
}

type IState = {
  isAdmin: boolean;
  tileWidth: number;
  colSize: string[];
}

class TileList extends PureComponent<IProps, IState> {
  wrapper: any;

  constructor(props: IProps) {
    super(props);
    this.wrapper = React.createRef();

    this.state = {
      isAdmin: false,
      tileWidth: 0,
      colSize: ['0px', '0px']
    };
  }

  componentDidMount(): void {
    //fetchTiles
    const { dispatch } = this.props;
    dispatch(fetchTiles());

    AdminController.fetchIsAdmin().then((response: IBackendResponse) => {
      this.setState({isAdmin: response.data});
    })
    window.addEventListener('resize', this.updateTileSize);
  }

  componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
    if (JSON.stringify(prevProps.tiles) !== JSON.stringify(this.props.tiles)) {
      this.updateTileSize();
    }
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.updateTileSize);
  }

  updateTileSize = () => {
    try {
      const offset = 50;
      const wrapperWidth = this.wrapper.current.getBoundingClientRect().width;
      if (wrapperWidth >= 990) {
        this.setState({
          tileWidth: ((wrapperWidth - offset) / 5), colSize: ['60%', '40%']
        });
      } else if (wrapperWidth >= 760) {
        this.setState({
          tileWidth: (((wrapperWidth - offset) - 1) / 3), colSize: [`${(100 / 3) * 2}%`, `${100 / 3}%`]
        });
      } else {
        this.setState({
          tileWidth: (((wrapperWidth - offset) - 2) / 2), colSize: ['100%', '100%']
        });
      }
    } catch {
      this.forceUpdate();
    }
  }

  render(): React.ReactNode {
    const { tiles } = this.props;
    const { tileWidth, colSize } = this.state;

    if (tiles === null) {
      return (
        <div style={{textAlign: "center"}}>
          <h1>Welcome to IguideME</h1>
          <Spin size="large" />
        </div>
      )
    }

    return (
      <div ref={this.wrapper} style={{padding: 20, boxSizing: 'border-box'}}>
        { this.state.isAdmin &&
          <div style={{marginBottom: 20}}>
						<Alert
							message={"Administrative tasks"}
							description={<div>
                You are an IguideME course administrator. Please click the button below to visit the administration panel.
                <br />
                <Button onClick={() => this.props.dispatch(setAdminView(true))} style={{marginTop: 15}}>
                  Admin panel
                </Button>
              </div>}
							type="info"
							showIcon
						/>
          </div>
        }

        <Row gutter={[5,5]}>
          <Col flex={colSize[0]} className={"tileWrapper"}>
            <Typography.Title level={3}>Activities</Typography.Title>

            {(tiles || []).sort((a, b) =>
              a.rank - b.rank
            ).filter(tile => tile.type === "activity").map(tile => {
              return (
                <Tile
                  tile={tile}
                  width={tileWidth}
                />
              )
            })}
          </Col>

          <Col flex={colSize[1]}>
            <div className={"tileWrapper"}>
              <Typography.Title level={3}>Course Grades</Typography.Title>
              {(tiles || []).sort((a, b) =>
                a.rank - b.rank
              ).filter(tile => tile.type === "grade").map(tile => {
                return (
                  <Tile
                    tile={tile}
                    width={tileWidth - 5}
                  />
                )
              })}
            </div>

            <br />

            <div className={"tileWrapper"}>
              <Typography.Title level={3}>
                Learning Outcome
              </Typography.Title>

              <Row justify={"center"}>
                {(tiles || []).sort((a, b) =>
                  a.rank - b.rank
                ).filter(tile => tile.type === "outcome").map(tile => {


                  return (
                    <Tile
                      tile={tile}
                      width={tileWidth}
                    />
                  )
                })}
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default connect(mapStateToProps)(TileList);


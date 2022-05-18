import React, { Component } from "react";
import { Badge, Cascader, Col, Row, Select } from "antd";
import { RootState } from "../../../../../../../../../store";
import { connect, ConnectedProps } from "react-redux";
import { getOptions } from "./helpers";
import { RelationshipRegistry } from "../../../../../../../../../models/app/GradePredictor";
import "./style.scss";
import TileController from "../../../../../../../../../api/controllers/tile";

type IProps = {
    rows: any[];
    registry: RelationshipRegistry | undefined;
    setEntry: (key: string, tile_id: number, entry_id: number) => any;
    setMetaKey: (key: string, entry_id: number, meta_key: string) => any;
}

const mapState = (state: RootState) => ({
    tiles: state.tiles,
    tileEntries: state.tileEntries,
});

const connector = connect(mapState)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = IProps & PropsFromRedux;

class RelationMapper extends Component<Props> {

    state = {
        loading: false,
        metaKeys: []
    }

    componentDidMount(): void {
        this.loadMetaKeys(this.props);
    }

    componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
        if (nextProps.registry?.entry_id !== this.props.registry?.entry_id) {
            this.loadMetaKeys(nextProps);
        }
    }

    loadMetaKeys = ({ registry }: Props) => {
        if (!registry) return;
        if (!registry.entry_id) return;

        this.setState({ loading: true }, () => {
            TileController.getTileEntriesMetaKeys(registry.entry_id).then(metaKeys => {
                this.setState({ metaKeys, loading: false });
            });
        });
    }

    getValue = () => {
        const { registry } = this.props;
        if (!registry) return undefined;

        if (registry.entry_id < 0) {
            return [registry.tile_id];
        }
        return [registry.tile_id, registry.entry_id];
    }

    render(): React.ReactNode {
        const { registry, tiles, tileEntries, _key } = this.props;
        const { loading, metaKeys } = this.state;

        return (
            <div className={"relationship"}>
                <Row gutter={[10, 20]}>
                    <Col xs={12}>
                        <span>Source key</span>
                        <h3><strong>{_key}</strong></h3>
                    </Col>
                    <Col xs={12}>
                        <span>Tile Entry</span>
                        <br />
                        <Cascader options={getOptions(tiles, tileEntries)}
                            value={this.getValue()}
                            style={{ width: '100%' }}
                            onChange={(val, _) => {
                                if (val.length === 2) {
                                    this.props.setEntry(_key, val[0] as number, val[1] as number);
                                } else if (val.length === 1) {
                                    this.props.setEntry(_key, val[0] as number, -1);
                                }
                            }}
                            size={"large"}
                            placeholder={"Select tile entry"} />
                    </Col>
                    <Col xs={12}>
                        <span>Meta property</span>
                        <br />
                        <Select disabled={(registry?.tile_id ?
                            tiles.find(t => t.id === registry.tile_id)!.type !== "EXTERNAL_DATA" : true)}
                            style={{ width: '100%' }}
                            defaultValue={registry ? registry.meta_key : "grade"}
                            loading={loading}
                            value={registry ? registry.meta_key : undefined}
                            size={"large"}
                            onChange={(val, _) => {
                                // input should be disabled if registry does not exist
                                if (registry) {
                                    this.props.setMetaKey(registry?.source_key, registry?.entry_id, val);
                                }
                            }}
                            options={[
                                { value: 'grade', label: 'Grade (default)' },
                                ...metaKeys.map(k => ({ value: k, label: k }))
                            ]} />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default connector(RelationMapper);

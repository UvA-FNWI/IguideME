import React, { Component } from "react";
import RelationMapper from "./RelationMapper";
import { RelationshipRegistry } from "../../../../../../../../models/app/GradePredictor";
import { Button, Divider } from "antd";

type IProps = {
    data: any[];
    registry: RelationshipRegistry[];
    setRegistry: (data: RelationshipRegistry[]) => any;
    nextStep: () => any;
}

export default class Relationships extends Component<IProps> {

    getKeysFromSource = () => {
        const { data } = this.props;
        let keys = new Set(...data.map(x => Object.keys(x)));
        keys.delete("final_grade");

        return Array.from(keys).filter(k => k.length > 0);
    }

    setEntry = (source_key: string, tile_id: number, entry_id: number) => {
        let registry: RelationshipRegistry[] = JSON.parse(JSON.stringify(this.props.registry));
        const idx = registry.findIndex(r => r.source_key === source_key);

        if (idx >= 0) {
            registry[idx].tile_id = tile_id;
            registry[idx].entry_id = entry_id;
            registry[idx].meta_key = "grade";
            this.props.setRegistry(registry);
        } else {
            this.props.setRegistry([...registry, {
                tile_id, entry_id, source_key, meta_key: "grade"
            }])
        }
    }

    setMetaKey = (source_key: string, entry_id: number, meta_key: string) => {
        let registry: RelationshipRegistry[] =
            JSON.parse(JSON.stringify(this.props.registry));
        const idx = registry.findIndex(r => r.source_key === source_key && r.entry_id === entry_id);

        if (idx >= 0) {
            registry[idx].meta_key = meta_key;
            this.props.setRegistry(registry);
        }
    }

    render(): React.ReactNode {
        const { registry, data } = this.props;
        return (
            <div id={"relationships"}>
                <h2>Step 2. Establish relationships</h2>
                { this.getKeysFromSource().sort().map(k =>
                    <div>
                        <RelationMapper registry={registry.find(r => r.source_key === k)}
                            setEntry={this.setEntry}
                            setMetaKey={this.setMetaKey}
                            _key={k}
                            data={data}
                        />
                    </div>
                )}
                <Divider />

                { registry.length < 4 &&
                    <div style={{ padding: '10px 0' }}>
                        <strong>You must provide at least four components!</strong>
                    </div>
                }

                <Button onClick={this.props.nextStep} disabled={registry.length < 4}>
                    Train models
        </Button>
            </div>
        )
    }
}

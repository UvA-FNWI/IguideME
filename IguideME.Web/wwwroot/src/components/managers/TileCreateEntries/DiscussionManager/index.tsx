import React, { Component } from "react";
import {Divider, Switch, Table} from "antd";
import {getColumns} from "./helpers";
import CreatableSelect from "react-select/creatable";
import FadeIn from "react-fade-in";
import {IManagerProps} from "../types";
import {IProps} from "./types";
import {TileEntry} from "../../../../models/app/Tile";

type Props = IManagerProps & IProps;

class DiscussionManager extends Component<Props> {


  addDiscussion = (title: string) => {
    const { canvasDiscussions, tile }: Props = this.props;
    const assignment = canvasDiscussions.find(d => d.title === title);

    const entry: TileEntry = {
      id: -1,
      tile_id: tile ? tile.id : -1,
      title: !assignment ? title : assignment.title,
      type: "DISCUSSION"
    }

    this.props.addEntry(entry);
  }

  render(): React.ReactNode {
    const { activeDiscussions, canvasDiscussions, wildcard } = this.props;

    return (
      <div id={"discussionManager"}>
        <h2>Configure discussion metric.</h2>
        <Divider />
        <span>
          <Switch checked={wildcard}
                  onChange={(val) => {
                    this.props.setWildcard(val)
                  }}
                  style={{zIndex: 0}}
          />
          &nbsp;
          <strong>Count all user posts.</strong> When enabled all posted submissions will be extracted for all students. If you wish to count the replies to a certain post uncheck this functionality and specify the posts you wish to track the replies of.
        </span>

        { !wildcard &&
          <FadeIn>
            <div id={"assignmentRegistry"}>
              <Table columns={getColumns(this.props.removeEntry, canvasDiscussions)}
                     pagination={false}
                     dataSource={activeDiscussions}
              />
            </div>

            <div>
              <CreatableSelect
                options={canvasDiscussions
                  .filter(a => !activeDiscussions.map(x => x.title).includes(a.title) )
                  .map(a => ({ label: a.title, value: a.id }))}
                onCreateOption={(title: string) => this.addDiscussion(title)}
                onChange={(e) => this.addDiscussion(e!.label.toString())}
                value={null}
              />
            </div>
          </FadeIn>
        }
      </div>
    )
  }
}

export default DiscussionManager;
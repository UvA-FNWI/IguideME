import {
  AssignmentDetail,
  DiscussionDetail,
  LearningGoalDetail,
} from "@/components/atoms/entry-details/entry-details";
import { TileType, type TileEntry } from "@/types/tile";
import { Row } from "antd";
import { type FC, type ReactElement } from "react";

interface Props {
  entry: TileEntry;
  type: TileType;
}
const EntryView: FC<Props> = ({ entry, type }): ReactElement => {
  return (
    <div className="tileView">
      <Row justify={"center"} align={"middle"} style={{ height: "20%" }}>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 1400,
            fontFamily: '"Antic Slab", serif',
            lineHeight: "normal",
          }}
        >
          {entry.title}
        </h3>
      </Row>
      {renderViewType()}
    </div>
  );

  function renderViewType(): ReactElement {
    switch (type) {
      case TileType.assignments:
        return <AssignmentDetail entry={entry} />;
      case TileType.discussions:
        return <DiscussionDetail entry={entry} />;
      case TileType.learning_outcomes:
        return <LearningGoalDetail entry={entry} />;
    }
  }
};

export default EntryView;

import { getAssignmentSubmission, getDiscussion } from "@/api/entries";
import { GradeView } from "@/components/crystals/grid-tile/grid-tile";
import { tileViewContext } from "@/components/pages/student-dashboard/context";
import Loading from "@/components/particles/loading";
import PeerComparison from "@/components/particles/peer-comparison/peercomparison";
import { type TileEntry } from "@/types/tile";
import { Divider, Row } from "antd";
import { Col } from "antd/lib";
import { useContext, type FC, type ReactElement } from "react";
import { useQuery } from "react-query";
import GraphGrade from "../graph-grade/graph-grade";

interface Props {
  entry: TileEntry;
}
export const AssignmentDetail: FC<Props> = ({ entry }): ReactElement => {
  const context = useContext(tileViewContext);
  const { data: submission } = useQuery(
    `entry/${entry.content_id}/${context.user.studentnumber}`,
    async () =>
      await getAssignmentSubmission(entry.content_id, context.user.userID),
  );

  if (submission === undefined) {
    return <Loading />;
  }

  switch (context.viewType) {
    case "graph":
      return (
        <Row justify={"center"} align={"middle"} style={{ height: "80%" }}>
          <GraphGrade {...submission.grades} />
        </Row>
      );
    case "grid":
      return (
        <>
          <Row justify={"center"} align={"middle"} style={{ height: "50%" }}>
            <GradeView {...submission.grades} />
          </Row>
          <Row justify={"center"} align={"top"} style={{ height: "30%" }}>
            <Col style={{ width: "100%" }}>
              <Divider style={{ margin: 0, padding: 0 }} />
              <PeerComparison {...submission.grades} />
            </Col>{" "}
          </Row>
        </>
      );
  }
};

export const DiscussionDetail: FC<Props> = ({ entry }): ReactElement => {
  const context = useContext(tileViewContext);
  const { data: discussion } = useQuery(
    `entry/${entry.content_id}/${context.user.userID}`,
    async () => await getDiscussion(entry.content_id, context.user.userID),
  );
  if (discussion === undefined) {
    return <Loading />;
  }
  console.log("disc", discussion);
  return <>{discussion.message}</>;
};
export const LearningGoalDetail: FC<Props> = ({ entry }): ReactElement => {
  return <></>;
};

import GraphGrade from '../graph-grade/graph-grade';
import Loading from '@/components/particles/loading';
import PeerComparison from '@/components/particles/peer-comparison/peercomparison';
import { Col } from 'antd/lib';
import { Divider, Row } from 'antd';
import { getAssignmentSubmission, getDiscussion } from '@/api/entries';
import { GradeView } from '@/components/crystals/grid-tile/grid-tile';
import { useQuery } from 'react-query';
import { useTileViewStore } from '@/components/pages/student-dashboard/tileViewContext';
import { type TileEntry } from '@/types/tile';
import { type FC, type ReactElement } from 'react';

interface Props {
  entry: TileEntry;
}
export const AssignmentDetail: FC<Props> = ({ entry }): ReactElement => {
  const { user, viewType } = useTileViewStore((state) => ({
    user: state.user,
    viewType: state.viewType,
  }));

  const { data: submission } = useQuery(
    `entry/${entry.content_id}/${user.studentnumber}`,
    async () => await getAssignmentSubmission(entry.content_id, user.userID),
  );

  if (submission === undefined) {
    return <Loading />;
  }

  switch (viewType) {
    case 'graph':
      return (
        <Row className="justify-center content-center h-4/5">
          <GraphGrade {...submission.grades} />
        </Row>
      );
    case 'grid':
      return (
        <>
          <Row className="justify-center content-center h-1/2">
            <GradeView {...submission.grades} />
          </Row>
          <Row className="justify-center content-start h-[30%]">
            <Col className="w-full">
              <Divider className="m-0 p-0" />
              <PeerComparison {...submission.grades} />
            </Col>{' '}
          </Row>
        </>
      );
    default:
      // TODO: Add a default case
      return <></>;
  }
};

export const DiscussionDetail: FC<Props> = ({ entry }): ReactElement => {
  const user = useTileViewStore((state) => state.user);

  const { data: discussion } = useQuery(
    `entry/${entry.content_id}/${user.userID}`,
    async () => await getDiscussion(entry.content_id, user.userID),
  );
  if (discussion === undefined) {
    return <Loading />;
  }
  console.log('disc', discussion);
  return <>{discussion.message}</>;
};

export const LearningGoalDetail: FC<Props> = ({ entry }): ReactElement => {
  return <></>;
};

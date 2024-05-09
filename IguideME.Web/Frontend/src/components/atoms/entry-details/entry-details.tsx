import { getAssignments, getAssignmentSubmission, getDiscussion, getLearningGoal } from '@/api/entries';
import { GradeView } from '@/components/crystals/grid-tile/grid-tile';
import { useTileViewStore } from '@/components/pages/student-dashboard/tileViewContext';
import PeerComparison from '@/components/particles/peer-comparison/peercomparison';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { printLogicalExpression, type TileEntry } from '@/types/tile';
import { CheckCircleTwoTone, CheckOutlined, CloseCircleTwoTone, CloseOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Divider, Row } from 'antd';
import { Col } from 'antd/lib';
import { type FC, type ReactElement } from 'react';
import GraphGrade from '../graph-grade/graph-grade';

interface Props {
  entry: TileEntry;
}

export const AssignmentDetail: FC<Props> = ({ entry }): ReactElement => {
  const { user, viewType } = useTileViewStore((state) => ({
    user: state.user,
    viewType: state.viewType,
  }));

  const {
    data: submission,
    isError,
    isLoading,
  } = useQuery({
    queryKey: [`${entry.tile_id}/entry/${entry.content_id}/${user.userID}`],
    queryFn: async () => await getAssignmentSubmission(entry.content_id, user.userID),
  });

  if (isLoading) {
    return (
      <QueryLoading isLoading={isLoading}>
        <div className='h-[180px] w-[270px]' />
      </QueryLoading>
    );
  } else if (isError || !submission) {
    return <QueryError className='grid place-content-center' title='No submission found' />;
  }

  switch (viewType) {
    case 'graph':
      return (
        <Row className='h-4/5 content-center justify-center'>
          <GraphGrade {...submission.grades} />
        </Row>
      );
    case 'grid':
      return (
        <>
          <Row className='h-1/2 content-center justify-center'>
            <GradeView {...submission.grades} />
          </Row>
          <Row className='h-[30%] content-start justify-center'>
            <Col className='w-full'>
              <Divider className='m-0 p-0' />
              <PeerComparison {...submission.grades} />
            </Col>{' '}
          </Row>
        </>
      );
    default:
      throw new Error('Unknown view type');
  }
};

export const DiscussionDetail: FC<Props> = ({ entry }): ReactElement => {
  const user = useTileViewStore((state) => state.user);

  const {
    data: discussion,
    isError,
    isLoading,
  } = useQuery({
    queryKey: [`${entry.tile_id}/entry/${entry.content_id}/${user.userID}`],
    queryFn: async () => await getDiscussion(entry.content_id, user.userID),
  });

  if (isLoading) {
    return (
      <QueryLoading isLoading={isLoading}>
        <div className='h-[180px] w-[270px]' />
      </QueryLoading>
    );
  } else if (isError || !discussion) {
    return <QueryError className='grid place-content-center' title='No submission found' />;
  } else return <>{discussion.message}</>;
};

export const LearningGoalDetail: FC<Props> = ({ entry }): ReactElement => {
  const user = useTileViewStore((state) => state.user);
  const {
    data: learningGoal,
    isError,
    isLoading,
  } = useQuery({
    // TODO: I think using entry.content_id might give conflicts
    queryKey: [`${entry.tile_id}/entry/${entry.content_id}/${user.userID}`],
    queryFn: async () => await getLearningGoal(entry.content_id, user.userID),
  });

  console.log('test', learningGoal);
  const {
    data: assignments,
    isError: assIsError,
    isLoading: assIsLoading,
  } = useQuery({
    queryKey: ['assignments'],
    queryFn: getAssignments,
  });

  if (isLoading || assIsLoading) {
    return (
      <QueryLoading isLoading={isLoading}>
        <div className='h-[180px] w-[270px]' />
      </QueryLoading>
    );
  } else if (isError || !learningGoal || assIsError || !assignments) {
    return <QueryError className='grid place-content-center' title='No submission found' />;
  }

  return (
    <>
      <Row className='h-2/5 content-center justify-center'>
        {learningGoal.results?.every((b) => b) ?
          <>
            Passed
            <CheckCircleTwoTone className='text-2xl' />
          </>
        : <>
            Failed
            <CloseCircleTwoTone className='text-2xl' />
          </>
        }
      </Row>
      <Row className='h-2/5 content-center justify-center overflow-y-scroll'>
        {learningGoal.requirements.map((req, i) => {
          const result = learningGoal.results?.[i];
          const ass = assignments.get(req.assignment_id);
          if (!ass) {
            return <></>;
          }
          return (
            <div key={i}>
              {ass.title} {printLogicalExpression(req.expression)} {req.value}
              {result ?
                <CheckOutlined />
              : <CloseOutlined />}
            </div>
          );
        })}
      </Row>
    </>
  );
};

import { getAssignmentSubmission, getAssignments, getDiscussion, getLearningGoal } from '@/api/entries';
import { GradeView } from '@/components/crystals/grid-tile/grid-tile';
import { useTileViewStore } from '@/components/pages/student-dashboard/tileViewContext';
import PeerComparison from '@/components/particles/peer-comparison/peercomparison';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { printLogicalExpression, type TileEntry } from '@/types/tile';
import { useQuery } from '@tanstack/react-query';
import { Divider, Row } from 'antd';
import { Col } from 'antd/lib';
import { type FC, type ReactElement } from 'react';
import GraphGrade from '../graph-grade/graph-grade';
import { CheckCircleOutlined, CheckCircleTwoTone, CheckOutlined, CloseCircleTwoTone, CloseOutlined } from '@ant-design/icons';

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
    queryKey: [`entry/${entry.content_id}/${user.studentnumber}`],
    queryFn: async () => await getAssignmentSubmission(entry.content_id, user.userID),
  });

  if (isLoading) {
    return (
      <QueryLoading isLoading={isLoading}>
        <div className='w-[270px] h-[180px]' />
      </QueryLoading>
    );
  } else if (isError || !submission) {
    return <QueryError className='grid place-content-center' title='No submission found' />;
  }

  switch (viewType) {
    case 'graph':
      return (
        <Row className='justify-center content-center h-4/5'>
          <GraphGrade {...submission.grades} />
        </Row>
      );
    case 'grid':
      return (
        <>
          <Row className='justify-center content-center h-1/2'>
            <GradeView {...submission.grades} />
          </Row>
          <Row className='justify-center content-start h-[30%]'>
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
    queryKey: [`entry/${entry.content_id}/${user.userID}`],
    queryFn: async () => await getDiscussion(entry.content_id, user.userID),
  });

  if (isLoading) {
    return (
      <QueryLoading isLoading={isLoading}>
        <div className='w-[270px] h-[180px]' />
      </QueryLoading>
    );
  } else if (isError || !discussion) {
    return <QueryError className='grid place-content-center' title='No submission found' />;
  }

  else return <>{discussion.message}</>;
};

export const LearningGoalDetail: FC<Props> = ({ entry }): ReactElement => {
  const user = useTileViewStore((state) => state.user);
  const {
    data: learningGoal,
    isError,
    isLoading,
  } = useQuery({
    // TODO: I think using entry.content_id might give conflicts
    queryKey: [`entry/${entry.content_id}/${user.userID}`],
    queryFn: async () => await getLearningGoal(entry.content_id, user.userID),
  });

  const { data: assignments, isError: assIsError, isLoading: assIsLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: getAssignments,
  });
  

  if (isLoading || assIsLoading) {
    return (
      <QueryLoading isLoading={isLoading}>
        <div className='w-[270px] h-[180px]' />
      </QueryLoading>
    );
  } else if (isError || !learningGoal || assIsError || !assignments) {
    return <QueryError className='grid place-content-center' title='No submission found' />;
  }

  
  return <>
      <Row className='justify-center content-center h-2/5'>
        {learningGoal.results?.every(b => b) ? 
          <>Passed
      <CheckCircleTwoTone className='text-2xl'/></> : 
      <>Failed<CloseCircleTwoTone className='text-2xl' /></>}
      </Row>
    <Row className='justify-center content-center h-2/5 overflow-y-scroll'>
        {
    learningGoal.requirements.map((req, i) => {
      const result = learningGoal.results?.[i]
      const ass = assignments.get(req.assignment_id)
      if (!ass) {
        return <></>
      }
      return <div key={i}>
        {ass.title} {printLogicalExpression(req.expression)} {req.value}
        {result ? <CheckOutlined /> : <CloseOutlined />}
        </div>
    })
  }      
    </Row>
  </>
;
};

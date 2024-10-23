import GraphGrade from '../graph-grade/graph-grade';
import PeerComparison from '@/components/particles/peer-comparison/peercomparison';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { CheckCircleOutlined, CheckOutlined, CloseCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import { getAssignments } from '@/api/entries';
import { GradeView } from '@/components/crystals/grid-tile/grid-tile';
import { useQuery } from '@tanstack/react-query';
import { useTileViewStore } from '@/components/pages/student-dashboard/tileViewContext';
import { printLogicalExpression, type TileEntry } from '@/types/tile';
import { type FC, type ReactElement } from 'react';
import { getAssignmentSubmission, getDiscussionEntries, getLearningGoal } from '@/api/grades';

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
        <div className='grid h-5/6 w-full place-content-center'>
          <GraphGrade {...submission.grades} />
        </div>
      );
    case 'grid':
      return (
        <div className='flex h-4/5 w-full flex-col justify-between'>
          <div className='grid flex-grow place-content-center'>
            <GradeView {...submission.grades} />
          </div>
          <div>
            <Divider className='border-text m-0 p-0' />
            <PeerComparison grades={submission.grades} />
          </div>
        </div>
      );
    default:
      throw new Error('Unknown view type');
  }
};

export const DiscussionDetail: FC<Props> = ({ entry }): ReactElement => {
  const { user, viewType } = useTileViewStore((state) => ({ user: state.user, viewType: state.viewType }));

  const {
    data: discussion,
    isError,
    isLoading,
  } = useQuery({
    queryKey: [`${entry.tile_id}/entry/${entry.content_id}/${user.userID}`],
    queryFn: async () => await getDiscussionEntries(entry.content_id, user.userID),
  });

  if (isLoading) {
    return (
      <QueryLoading isLoading={isLoading}>
        <div className='h-[180px] w-[270px]' />
      </QueryLoading>
    );
  } else if (isError || !discussion || !discussion.grades) {
    return <QueryError className='grid place-content-center' title='No submission found' />;
  }

  switch (viewType) {
    case 'graph':
      return (
        <div className='grid h-full w-full place-content-center'>
          <GraphGrade {...discussion.grades} />
        </div>
      );
    case 'grid':
      return (
        <div className='flex h-4/5 w-full flex-col justify-between'>
          <div className='grid flex-grow place-content-center'>
            <GradeView {...discussion.grades} />
          </div>
          <div>
            <Divider className='border-text m-0 p-0' />
            <PeerComparison grades={discussion.grades} />
          </div>
        </div>
      );
    default:
      throw new Error('Unknown view type');
  }
};

export const LearningGoalDetail: FC<Props> = ({ entry }): ReactElement => {
  const user = useTileViewStore((state) => state.user);
  const {
    data: learningGoal,
    isError,
    isLoading,
  } = useQuery({
    queryKey: [`${entry.tile_id}/entry/${entry.content_id}/${user.userID}`],
    queryFn: async () => await getLearningGoal(entry.content_id, user.userID),
  });

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
    <div className='h-full w-full p-2'>
      <div className='flex h-1/5 items-baseline justify-between gap-4'>
        {learningGoal.results?.every((b) => b) ?
          <span className='text-subtext1 flex place-content-center gap-2 text-sm'>
            Passed
            <CheckCircleOutlined className='text-text [&_svg]:!fill-success' />
          </span>
        : <span className='flex place-content-center gap-2 text-sm'>
            Failed
            <CloseCircleOutlined className='text-text [&_svg]:!fill-failure' />
          </span>
        }
      </div>

      <div className='flex h-4/5 w-full flex-col overflow-auto'>
        <h4 className='text-subtext1 mb-2 flex-shrink-0 underline'>Sub-goals</h4>
        <ul className='text-subtext1 h-full flex-grow overflow-auto'>
          {learningGoal.requirements.map((req, i) => {
            const result = learningGoal.results?.[i];
            const ass = assignments.get(req.assignment_id);
            if (!ass) return null;

            return (
              <li className='list-item text-nowrap text-sm' key={i}>
                {result ?
                  <>
                    <CheckOutlined className='text-success mr-2 text-xs' />
                    {ass.title} {printLogicalExpression(req.expression)} {req.value}
                  </>
                : <>
                    <CloseOutlined className='text-failure mr-2 text-xs' />
                    {ass.title} {printLogicalExpression(req.expression)} {req.value}
                  </>
                }
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

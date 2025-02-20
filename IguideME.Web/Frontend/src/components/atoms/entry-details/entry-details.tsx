import { getAssignments } from '@/api/entries';
import { getAssignmentSubmission, getDiscussionEntries, getLearningGoal } from '@/api/grades';
import { GradeView } from '@/components/crystals/grid-tile/grid-tile';
import { useTileViewStore } from '@/components/pages/student-dashboard/tileViewContext';
import PeerComparison from '@/components/particles/peer-comparison/peercomparison';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { printLogicalExpression, type TileEntry, type ViewType } from '@/types/tile';
import {
    CheckCircleOutlined,
    CheckOutlined,
    CloseCircleOutlined,
    CloseOutlined,
    SlidersOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Divider } from 'antd';
import { type FC, type ReactElement } from 'react';
import { useShallow } from 'zustand/react/shallow';
import GraphGrade from '../graph-grade/graph-grade';

interface Props {
  entry: TileEntry;
  viewType: ViewType;
}

export const AssignmentDetail: FC<Props> = ({ entry, viewType }): ReactElement => {
  const { user } = useTileViewStore(
    useShallow((state) => ({
      user: state.user,
    })),
  );

  const {
    data: submission,
    error,
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
  }

  if (error && !error?.message.includes('data is undefined')) {
    return (
      <div className='relative h-full'>
        <QueryError className='grid place-content-center' title='No submission found' />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className='!flex h-full w-full flex-col gap-3 !items-center !justify-center'>
        <SlidersOutlined className='text-text/50' style={{ fontSize: '400%' }} />
        <p><i>No submission</i></p>
      </div>
    );
  }

  switch (viewType) {
    case 'graph':
      return (
        <div className='grid h-5/6 w-full place-content-center'>
          <GraphGrade {...submission.grades} />
        </div>
      );
    case 'grades':
      return (
        <div className='!flex h-full w-full flex-col justify-between'>
          <div className='grid flex-grow place-content-center'>
            <GradeView {...submission.grades} />
          </div>
          <div className='shrink-0'>
            <Divider className='m-0 border-text p-0' />
            <PeerComparison grades={submission.grades} />
          </div>
        </div>
      );
    default:
      throw new Error('Unknown view type');
  }
};

export const DiscussionDetail: FC<Props> = ({ entry, viewType }): ReactElement => {
  const { user } = useTileViewStore(useShallow((state) => ({ user: state.user })));

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
  }

  if (isError) {
    return (
      <div className='relative h-3/4'>
        <QueryError className='grid place-content-center' title='No submission found' />
      </div>
    );
  }

  if (!discussion?.grades) {
    return (
      <div className='!flex h-full w-full !items-center !justify-center'>
        <SlidersOutlined className='text-text/50' style={{ fontSize: '400%' }} />
      </div>
    );
  }

  switch (viewType) {
    case 'graph':
      return (
        <div className='grid h-full w-full place-content-center'>
          <GraphGrade {...discussion.grades} />
        </div>
      );
    case 'grades':
      return (
        <div className='flex h-4/5 w-full flex-col justify-between'>
          <div className='grid flex-grow place-content-center'>
            <GradeView {...discussion.grades} />
          </div>
          <div>
            <Divider className='m-0 border-text p-0' />
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
  }

  if (isError || assIsError) {
    return (
      <div className='relative h-3/4'>
        <QueryError className='grid place-content-center' title='No submission found' />
      </div>
    );
  }

  if (!learningGoal || !assignments) {
    return (
      <div className='!flex h-full w-full !items-center !justify-center'>
        <SlidersOutlined className='text-text/50' style={{ fontSize: '400%' }} />
      </div>
    );
  }

  return (
    <div className='h-full w-full p-2'>
      <div className='flex h-1/6 items-baseline justify-center gap-4'>
        {learningGoal.results?.every((b) => b) ?
          <span className='flex place-content-center gap-2 text-sm text-subtext1'>
            Passed
            <CheckCircleOutlined className='text-text [&_svg]:!fill-success' />
          </span>
        : <span className='flex place-content-center gap-2 text-sm'>
            Failed
            <CloseCircleOutlined className='text-text [&_svg]:!fill-failure' />
          </span>
        }
      </div>

      <div className='flex h-5/6 w-full flex-col overflow-auto'>
        <h4 className='mb-2 flex-shrink-0 text-subtext1 underline'>Sub-goals</h4>
        <ul className='h-full flex-grow overflow-auto text-subtext1'>
          {learningGoal.requirements.map((req, i) => {
            const result = learningGoal.results?.[i];
            const ass = assignments.get(req.assignment_id);
            if (!ass) return null;

            return (
              <li className='list-item text-nowrap text-sm' key={i}>
                {result ?
                  <>
                    <CheckOutlined className='mr-2 text-xs text-success' />
                    {ass.title} {printLogicalExpression(req.expression)} {req.value}
                  </>
                : <>
                    <CloseOutlined className='mr-2 text-xs text-failure' />
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

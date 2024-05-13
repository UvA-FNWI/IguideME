import { getAssignments, getAssignmentSubmission, getDiscussion, getLearningGoal } from '@/api/entries';
import { GradeView } from '@/components/crystals/grid-tile/grid-tile';
import { useTileViewStore } from '@/components/pages/student-dashboard/tileViewContext';
import PeerComparison from '@/components/particles/peer-comparison/peercomparison';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { printLogicalExpression, type TileEntry } from '@/types/tile';
import { CheckCircleOutlined, CheckOutlined, CloseCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Divider } from 'antd';
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
        <div className='h-full w-full p-2'>
          <h3 className='overflow-hidden text-ellipsis text-nowrap text-center text-base font-bold'>{entry.title}</h3>
          <div className='grid h-full w-full place-content-center'>
            <GraphGrade {...submission.grades} />
          </div>
        </div>
      );
    case 'grid':
      return (
        <div className='h-full w-full p-2'>
          <h3 className='h-1/5 max-w-[270px] overflow-hidden text-ellipsis text-nowrap text-center text-base font-bold'>
            {entry.title}
          </h3>
          <div className='flex h-4/5 w-full flex-col justify-between'>
            <div className='grid h-2/5 place-content-center'>
              <GradeView {...submission.grades} />
            </div>
            <div>
              <Divider className='m-0 p-0' />
              <PeerComparison {...submission.grades} />
            </div>
          </div>
        </div>
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
  } else
    return (
      <div className='h-full w-full p-2'>
        <h3 className='overflow-hidden text-ellipsis text-nowrap text-center text-base font-bold'>{entry.title}</h3>
        <p>{discussion.message}</p>
      </div>
    );
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
    <div className='h-full w-full p-2'>
      <div className='flex items-center justify-between gap-4'>
        <h3 className='overflow-hidden text-ellipsis text-nowrap text-base font-bold'>{entry.title}</h3>
        {learningGoal.results?.every((b) => b) ?
          <span className='flex place-content-center gap-2 text-sm'>
            Passed
            <CheckCircleOutlined className='text-base [&_svg]:!fill-success' />
          </span>
        : <span className='flex place-content-center gap-2 text-sm'>
            Failed
            <CloseCircleOutlined className='text-base [&_svg]:!fill-success' />
          </span>
        }
      </div>

      <div className='mt-4 h-full w-full overflow-auto'>
        <h4 className='mb-2 text-base underline underline-offset-2'>Sub-goals</h4>
        <ul className='overflow-y-auto'>
          {learningGoal.requirements.map((req, i) => {
            const result = learningGoal.results?.[i];
            const ass = assignments.get(req.assignment_id);
            if (!ass) return null;

            return (
              <li className='list-item overflow-x-auto overflow-y-hidden text-nowrap text-xs' key={i}>
                {result ?
                  <>
                    <CheckOutlined className='mr-2 text-xs text-success' />
                    {ass.title} {printLogicalExpression(req.expression)} {req.value}
                  </>
                : <>
                    <CloseOutlined className='text-xs text-failure' />
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

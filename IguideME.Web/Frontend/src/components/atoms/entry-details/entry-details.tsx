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
          <h3 className='overflow-hidden text-ellipsis text-nowrap text-center text-text font-bold'>{entry.title}</h3>
          <div className='grid h-full w-full place-content-center'>
            <GraphGrade {...submission.grades} />
          </div>
        </div>
      );
    case 'grid':
      return (
        <div className='h-full w-full p-2'>
          <h3 className='h-1/5 max-w-[270px] overflow-hidden text-ellipsis text-nowrap text-center text-text font-bold'>
            {entry.title}
          </h3>
          <div className='flex h-4/5 w-full flex-col justify-between'>
            <div className='grid flex-grow place-content-center'>
              <GradeView {...submission.grades} />
            </div>
            <div>
              <Divider className='m-0 p-0 border-text' />
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
  }

  return (
    <div className='h-full w-full p-2'>
      <h3 className='overflow-hidden text-ellipsis text-nowrap text-center text-text font-bold'>{entry.title}</h3>
      {discussion.grades ?
        <div className='flex h-4/5 w-full flex-col justify-between'>
          <div className='grid flex-grow place-content-center'>
            <GradeView {...discussion.grades} />
          </div>
          <div>
            <Divider className='m-0 p-0 border-text' />
            <PeerComparison {...discussion.grades} />
          </div>
        </div>
      : <QueryError className='grid place-content-center' title='No submission found' />}
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
        <h3 className='overflow-hidden text-ellipsis text-nowrap text-text font-bold'>{entry.title}</h3>
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

      <div className='flex h-4/5 w-full flex-col overflow-auto'>
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

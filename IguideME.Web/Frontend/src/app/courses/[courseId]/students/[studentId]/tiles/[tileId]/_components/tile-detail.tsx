import type { ReactElement } from 'react';
import { Check, CircleAlert, Cross } from 'lucide-react';

import {
  getAssignments,
  getAssignmentSubmission,
  getDiscussionEntries,
  getLearningGoal,
  getTopics,
  getUserDiscussionEntries,
} from '@/api/entry';
import { StudentDashboardTileContent } from '@/app/courses/[courseId]/students/[studentId]/_components/student-dashboard-tile/student-dashboard-tile-content';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type Assignment,
  type DiscussionEntry,
  type DiscussionTopic,
  type LearningGoal,
  printLogicalExpression,
  type Submission,
  type Tile,
  type TileEntry,
} from '@/types/tile';

async function AssignmentTileDetail({
  entry,
  tile,
  userId,
}: {
  entry: TileEntry;
  tile: Tile;
  userId: string;
}): Promise<ReactElement> {
  let isError = false;
  let submission: Submission | undefined;

  try {
    submission = await getAssignmentSubmission(entry.content_id, userId);
  } catch {
    isError = true;
  }
  return (
    <Card className='h-[350px] w-[320px]'>
      <CardHeader className='text-center'>
        <CardTitle className='h-8 overflow-hidden text-ellipsis whitespace-nowrap text-xl'>{entry.title}</CardTitle>
      </CardHeader>
      <CardContent className='grid place-content-center'>
        {isError || !submission ?
          <div className='flex h-[180px] w-[250px] flex-col items-center justify-center gap-2'>
            <CircleAlert className='h-12 w-12 stroke-destructive' />
            <i className='text-base text-destructive'>Error: Grades could not be loaded</i>
          </div>
        : <StudentDashboardTileContent grades={{ tile_id: tile.id, ...submission.grades }} tile={tile} />}
      </CardContent>
      <CardFooter className='flex items-center justify-center'>
        <Button>Go to the Canvas page</Button>
      </CardFooter>
    </Card>
  );
}

async function DiscussionTileDetail({
  entry,
  tile,
  userId,
}: {
  entry: TileEntry;
  tile: Tile;
  userId: string;
}): Promise<ReactElement> {
  let isError = false;
  let discussionEntries: DiscussionTopic | undefined;
  let discussionTopics: DiscussionTopic[] = [];
  let userDiscussionEntries: DiscussionEntry[] = [];

  // TODO: Split this into separate components
  try {
    [discussionEntries, discussionTopics, userDiscussionEntries] = await Promise.all([
      getDiscussionEntries(entry.content_id, userId),
      getTopics(),
      getUserDiscussionEntries(userId),
    ]);
  } catch {
    isError = true;
  }

  if (tile.alt) {
    return (
      <>
        {discussionTopics
          .filter((topic) => topic.author === userId)
          .map((topic) => (
            <DiscussionsDisplay key={topic.id} message={topic.message} title={topic.title} />
          ))}
        {Array.isArray(userDiscussionEntries) &&
          userDiscussionEntries.map((e) => (
            <DiscussionsDisplay
              key={`e${String(e.id)}d${String(e.parent_id)}`}
              message={e.message}
              title={`Thread → ${discussionTopics.find((topic) => topic.id === e.discussion_id)?.title ?? ''}`}
            />
          ))}
      </>
    );
  }

  const grades = discussionEntries?.grades;

  return (
    <Card className='h-[350px] w-[320px]'>
      <CardHeader className='text-center'>
        <CardTitle className='h-8 overflow-hidden text-ellipsis whitespace-nowrap text-xl'>{entry.title}</CardTitle>
      </CardHeader>
      <CardContent className='grid place-content-center'>
        {isError || !grades ?
          <div className='flex h-[180px] w-[250px] flex-col items-center justify-center gap-2'>
            <CircleAlert className='h-12 w-12 stroke-destructive' />
            <i className='text-base text-destructive'>Error: Grades could not be loaded</i>
          </div>
        : <StudentDashboardTileContent grades={{ tile_id: tile.id, ...grades }} tile={tile} />}
      </CardContent>
      <CardFooter className='flex items-center justify-center'>
        <Button variant='secondary'>Goto Canvas page</Button>
      </CardFooter>
    </Card>
  );
}

function DiscussionsDisplay({ title, message }: { title: string; message: string }): ReactElement {
  return (
    <Card className='h-[230px] w-max min-w-[270px] max-w-xs'>
      <CardHeader className='text-center'>
        <CardTitle className='h-8 overflow-hidden text-ellipsis whitespace-nowrap text-xl'>{title}</CardTitle>
      </CardHeader>
      <CardContent className='grid place-content-center'>
        <div dangerouslySetInnerHTML={{ __html: message }} />
      </CardContent>
    </Card>
  );
}

async function LearningGoalTileDetail({ entry, userId }: { entry: TileEntry; userId: string }): Promise<ReactElement> {
  let isError = false;
  let assignments: Map<number, Assignment> | undefined;
  let learningGoal: LearningGoal | undefined;

  try {
    assignments = await getAssignments();
    learningGoal = await getLearningGoal(entry.content_id, userId);
  } catch {
    isError = true;
  }

  return (
    <Card className='h-[230px] w-[320px]'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='h-8 overflow-x-hidden text-ellipsis whitespace-nowrap text-xl'>{entry.title}</CardTitle>

        {learningGoal?.results?.every((b) => b) ?
          <span className='flex items-center justify-center gap-2 text-base'>
            Passed
            <Check className='size-4' />
          </span>
        : <span className='flex items-center justify-center gap-2 text-base'>
            Failed
            <Cross className='size-4' />
          </span>
        }
      </CardHeader>
      <CardContent>
        {isError || !assignments || !learningGoal ?
          <div className='flex h-[180px] w-[250px] flex-col items-center justify-center gap-2'>
            <CircleAlert className='h-12 w-12 stroke-destructive' />
            <i className='text-base text-destructive'>Error: Grades could not be loaded</i>
          </div>
        : <ul className='h-[calc(230px-80px-24px)] w-[calc(320px-48px)] overflow-auto'>
            {learningGoal.requirements.map((req, i) => {
              const result = learningGoal.results?.[i];
              const ass = assignments.get(req.assignment_id);
              if (!ass) return null;

              return (
                <li className='flex items-center whitespace-nowrap text-sm' key={req.id}>
                  {result ?
                    <>
                      <Check className='mr-2 size-4 flex-shrink-0' />
                      {ass.title} {printLogicalExpression(req.expression)} {req.value}
                    </>
                  : <>
                      <Cross className='mr-2 size-4 flex-shrink-0' />
                      {ass.title} {printLogicalExpression(req.expression)} {req.value}
                    </>
                  }
                </li>
              );
            })}
          </ul>
        }
      </CardContent>
    </Card>
  );
}

export { AssignmentTileDetail, DiscussionTileDetail, LearningGoalTileDetail };

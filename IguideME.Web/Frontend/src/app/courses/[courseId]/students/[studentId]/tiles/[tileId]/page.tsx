import { type ReactElement } from 'react';
import { CircleAlert } from 'lucide-react';
import Link from 'next/link';

import { getTile } from '@/api/tiles';
import { StudentDashboardTabsWrapper } from '@/app/courses/[courseId]/students/[studentId]/_components/student-dashboard-tabs-wrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Tile, type TileEntry, TileType } from '@/types/tile';

import { AssignmentTileDetail, DiscussionTileDetail, LearningGoalTileDetail } from './_components/tile-detail';

interface TileDetailsParams {
  courseId: string;
  studentId: string;
  tileId: string;
}

export default async function TileDetails({ params }: { params: TileDetailsParams }): Promise<ReactElement> {
  let isError = false;
  let tile: Tile | null = null;

  try {
    tile = await getTile(params.tileId);
  } catch {
    isError = true;
  }

  function renderViewType(entry: TileEntry, tl: Tile, type: TileType): ReactElement {
    switch (type) {
      case TileType.Assignments:
        return <AssignmentTileDetail entry={entry} tile={tl} userId={params.studentId} />;
      case TileType.Discussions:
        return <DiscussionTileDetail entry={entry} tile={tl} userId={params.studentId} />;
      case TileType.LearningOutcomes:
        return <LearningGoalTileDetail entry={entry} userId={params.studentId} />;
      default:
        throw new Error('Unknown tile type');
    }
  }

  return (
    <StudentDashboardTabsWrapper>
      <>
        <Button asChild className='mb-8 mt-4'>
          <Link href={`/courses/${params.courseId}/students/${params.studentId}`}>Back to overview</Link>
        </Button>
        <Card className='w-full'>
          <CardHeader>
            <CardTitle className='h-8 overflow-hidden text-ellipsis whitespace-nowrap'>{tile?.title}</CardTitle>
          </CardHeader>
          <CardContent className='flex w-full flex-wrap gap-6'>
            {isError || !tile ?
              <div className='flex h-[180px] w-[250px] flex-col items-center justify-center gap-2'>
                <CircleAlert className='h-12 w-12 stroke-destructive' />
                <i className='text-base text-destructive'>Error: Tile could not be loaded</i>
              </div>
            : tile.entries.map((entry) => <div key={entry.content_id}>{renderViewType(entry, tile, tile.type)}</div>)}
          </CardContent>
        </Card>
      </>
    </StudentDashboardTabsWrapper>
  );
}

import type { ReactElement } from 'react';
import { CircleAlert } from 'lucide-react';

import { getLayoutColumns } from '@/api/layout';
import { getTileGroups } from '@/api/tiles';
import type { LayoutColumn } from '@/types/layout';
import type { TileGroup } from '@/types/tile';

import { StudentDashboardTileGroup } from './student-dashboard-tile-group';

export async function StudentDashboardTileWrapper(): Promise<ReactElement> {
  let isError = false;
  let columns: LayoutColumn[] = [];
  let tileGroups: TileGroup[] = [];

  try {
    columns = await getLayoutColumns();
    tileGroups = await getTileGroups();
  } catch {
    isError = true;
  }

  if (isError) {
    return (
      <div className='flex w-full flex-col items-center justify-center gap-2'>
        <CircleAlert className='h-12 w-12 stroke-destructive' />
        <i className='text-base text-destructive'>Error: Dashboard could not be loaded</i>
      </div>
    );
  }

  const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

  return (
    <div className='flex w-full flex-wrap'>
      {sortedColumns.map((column) => {
        return (
          <div
            className='flex min-w-[320px] flex-col'
            key={column.id}
            style={{
              width: `${String(column.width)}%`,
            }}
          >
            {column.groups.map((groupId) => {
              const group = tileGroups.find((g) => g.id === groupId);

              if (!group) {
                return (
                  <p className='flex-1' key={`missing-group-${String(column.id)}-${String(groupId)}`}>
                    If you are an instructor, you can modify the layout and tiles in the course settings.
                    <br />
                    If you are a student, please notify your instructor.
                  </p>
                );
              }

              return (
                <div className='flex-1' key={groupId}>
                  <StudentDashboardTileGroup group={group} />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

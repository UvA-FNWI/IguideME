import type { ReactElement } from 'react';
import { CircleAlert } from 'lucide-react';

import { getLayoutColumns } from '@/api/layout';
import { AdminHeader } from '@/app/courses/[courseId]/admin/_components/admin-header';
import type { LayoutColumn } from '@/types/layout';

import { DndLayoutBoard } from './_components/dnd-layout-board/dnd-layout-board';

export default async function AdminLayout(): Promise<ReactElement> {
  let isError = false;
  let layoutColumns: LayoutColumn[] = [];

  try {
    layoutColumns = await getLayoutColumns();
  } catch {
    isError = true;
  }

  return (
    <>
      <AdminHeader title='Layout' subtitle='Configure the layout of the student dashboard.' />
      {isError ?
        <div className='flex flex-col items-center justify-center gap-2'>
          <CircleAlert className='h-12 w-12 stroke-destructive' />
          <i className='text-base text-destructive'>Error: Unable to load layout columns.</i>
        </div>
      : <DndLayoutBoard layoutColumnData={layoutColumns} />}
    </>
  );
}

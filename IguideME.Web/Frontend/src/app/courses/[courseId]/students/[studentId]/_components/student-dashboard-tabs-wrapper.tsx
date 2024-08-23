'use client';

import type { ReactElement } from 'react';
import { BarChart3, FileText, LayoutGrid } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTileViewStore } from '@/stores/tile-view-store';

import { StudentDashboardSummary } from './student-dashboard-summary';

export function StudentDashboardTabsWrapper({ children }: { children: ReactElement }): ReactElement {
  const { viewType, setViewType } = useTileViewStore(
    useShallow((state) => ({ viewType: state.viewType, setViewType: state.setViewType })),
  );

  return (
    <>
      <header className='w-80 md:mx-auto'>
        <Tabs className='h-10 w-full md:w-fit' defaultValue={viewType}>
          <TabsList className='w-full md:w-auto'>
            <TabsTrigger
              className='flex-1 flex-grow'
              onClick={() => {
                setViewType('summary');
              }}
              value='summary'
            >
              <FileText className='mr-2 size-4' />
              Summary
            </TabsTrigger>
            <TabsTrigger
              className='flex-1 flex-grow'
              onClick={() => {
                setViewType('graph');
              }}
              value='graph'
            >
              <BarChart3 className='mr-2 size-4' />
              Graph
            </TabsTrigger>
            <TabsTrigger
              className='flex-1 flex-grow'
              onClick={() => {
                setViewType('grid');
              }}
              value='grid'
            >
              <LayoutGrid className='mr-2 size-4' />
              Grid
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>
      <div className='mt-8'>
        {viewType === 'summary' ?
          <StudentDashboardSummary />
        : children}
      </div>
    </>
  );
}

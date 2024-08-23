'use client';

import type { ReactElement } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CircleAlert } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import { getTileGrades } from '@/api/tiles';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGlobalContext } from '@/stores/global-store/use-global-store';
import type { Tile } from '@/types/tile';

import { StudentDashboardTileContent } from './student-dashboard-tile-content';

export function StudentDashboardTileView({ tile }: { tile: Tile }): ReactElement {
  const { student } = useGlobalContext(useShallow((state) => ({ student: state.student })));

  const {
    data: grades,
    isError,
    isLoading,
  } = useQuery({ queryKey: ['tile', tile.id], queryFn: () => getTileGrades(student ? student.userID : '', tile.id) });

  const path = usePathname();
  const router = useRouter();

  return (
    <Card className='h-[350px] w-[320px]'>
      <CardHeader className='text-center'>
        <CardTitle className='h-8 overflow-hidden text-ellipsis whitespace-nowrap text-xl'>{tile.title}</CardTitle>
      </CardHeader>
      <CardContent className='grid place-content-center'>
        {isLoading ?
          <Skeleton className='h-[180px] w-[250px]' />
        : isError || !grades ?
          <div className='flex h-[180px] w-[250px] flex-col items-center justify-center gap-2'>
            <CircleAlert className='h-12 w-12 stroke-destructive' />
            <i className='text-base text-destructive'>Error: Grades could not be loaded</i>
          </div>
        : <StudentDashboardTileContent grades={grades} tile={tile} />}
      </CardContent>
      <CardFooter className='grid w-full place-content-center'>
        <Button
          disabled={isError || isLoading}
          onClick={() => {
            router.push(`${path}/tiles/${String(tile.id)}`);
          }}
        >
          View details
        </Button>
      </CardFooter>
    </Card>
  );
}

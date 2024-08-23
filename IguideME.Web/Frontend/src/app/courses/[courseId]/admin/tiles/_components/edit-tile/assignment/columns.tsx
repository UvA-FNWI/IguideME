'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { CheckCircle, CircleX } from 'lucide-react';

import { type GradingType, printGradingType } from '@/types/tile';

export interface AssignmentTableType {
  id: number;
  name: string;
  isPublished: boolean;
  gradingType: GradingType;
  weight: number;
}

export const columns: ColumnDef<AssignmentTableType>[] = [
  {
    accessorKey: 'id',
    header: () => <div className='text-center'>ID</div>,
    cell: ({ row }) => {
      const id = row.getValue('id');
      return <div className='text-center'>{id as number}</div>;
    },
  },
  {
    accessorKey: 'name',
    header: () => <div className='text-center'>Name</div>,
    cell: ({ row }) => {
      const name = row.getValue('name');
      return <div className='truncate text-left'>{name as string}</div>;
    },
  },
  {
    accessorKey: 'isPublished',
    header: () => <div className='text-center'>Published</div>,
    cell: ({ row }) => {
      const isPublished = row.getValue('isPublished');

      return (
        <div className='grid h-full w-full place-content-center'>
          {isPublished ?
            <CheckCircle className='size-6 stroke-success' />
          : <CircleX className='size-6 stroke-destructive' />}
        </div>
      );
    },
  },
  {
    accessorKey: 'gradingType',
    header: () => <div className='text-center'>Grading type</div>,
    cell: ({ row }) => {
      const gradingType = row.getValue('gradingType');
      return <div className='text-center'>{printGradingType(gradingType as GradingType)}</div>;
    },
  },
  {
    accessorKey: 'weight',
    header: () => <div className='text-center'>Weight (%)</div>,
    cell: ({ row }) => {
      const weight = row.getValue('weight');
      return <div className='text-center'>{(weight as number) * 100}%</div>;
    },
  },
];

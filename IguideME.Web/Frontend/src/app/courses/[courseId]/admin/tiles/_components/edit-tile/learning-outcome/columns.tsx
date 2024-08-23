'use client';

import { type ColumnDef } from '@tanstack/react-table';

export interface LearningOutcomeTableType {
  name: string;
  requirements: number;
}

export const columns: ColumnDef<LearningOutcomeTableType>[] = [
  {
    accessorKey: 'name',
    header: () => <div className='text-center'>Name</div>,
    cell: ({ row }) => {
      const name = row.getValue('name');
      return <div className='truncate text-left'>{name as string}</div>;
    },
  },
  {
    accessorKey: 'requirements',
    header: () => <div className='text-center'>Requirements</div>,
    cell: ({ row }) => {
      const requirements = row.getValue('requirements');
      return <div className='text-center'>{requirements as number}</div>;
    },
  },
];

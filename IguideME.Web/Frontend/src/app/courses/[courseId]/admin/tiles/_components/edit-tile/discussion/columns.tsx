'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export interface DiscussionTableType {
  name: string;
  author: string;
  date: number;
}

export const columns: ColumnDef<DiscussionTableType>[] = [
  {
    accessorKey: 'name',
    header: () => <div className='text-center'>Name</div>,
    cell: ({ row }) => {
      const name = row.getValue('name');
      return <div className='truncate text-left'>{name as string}</div>;
    },
  },
  {
    accessorKey: 'author',
    header: () => <div className='text-center'>Author</div>,
    cell: ({ row }) => {
      const author = row.getValue('author');
      return <div className='truncate text-left'>{author as string}</div>;
    },
  },
  {
    accessorKey: 'date',
    header: () => <div className='text-center'>Creation date</div>,
    cell: ({ row }) => {
      const date = row.getValue('date');
      const formattedDate = format(new Date((date as number) * 1000), 'PPpp');
      return <div className='text-center'>{formattedDate}</div>;
    },
  },
];

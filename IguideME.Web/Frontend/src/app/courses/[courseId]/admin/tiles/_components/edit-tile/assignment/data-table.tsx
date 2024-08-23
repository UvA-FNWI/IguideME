'use client';

import { type ReactElement, useState } from 'react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';

import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isError: boolean;
  onWeightChange: (id: number, weight: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isError,
  onWeightChange,
}: DataTableProps<TData, TValue>): ReactElement {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    name: true,
    isPublished: true,
    gradingType: true,
    weight: true,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isError ?
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                Error: Failed to retrieve the assignments.
              </TableCell>
            </TableRow>
          : table.getRowModel().rows.length ?
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => {
                  if (cell.column.id === 'weight') {
                    return (
                      <TableCell key={cell.id}>
                        <Input
                          className='min-w-20'
                          min={0}
                          max={100}
                          step={0.1}
                          type='number'
                          value={(cell.getValue() as number) * 100}
                          onChange={(e) => {
                            // @ts-expect-error -- The property does exist.
                            onWeightChange(cell.row.original.id as number, Number(e.target.value));
                          }}
                        />
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  );
                })}
              </TableRow>
            ))
          : <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No assignments selected.
              </TableCell>
            </TableRow>
          }
        </TableBody>
      </Table>
    </div>
  );
}

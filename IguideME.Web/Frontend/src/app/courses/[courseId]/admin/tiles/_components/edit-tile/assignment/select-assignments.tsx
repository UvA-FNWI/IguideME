'use client';

import { type ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getAssignments } from '@/api/entry';
import { FormLabel } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Assignment, GradingType, type TileEntry } from '@/types/tile';

import { type AssignmentTableType, columns } from './columns';
import { DataTable } from './data-table';

export function SelectAssignments({
  entries,
  onChange,
}: {
  entries: TileEntry[];
  onChange: (event: TileEntry[]) => void;
}): ReactElement {
  const { data, isError, isLoading } = useQuery({ queryKey: ['assignments'], queryFn: getAssignments });

  const [assignments, setAssignments] = useState<Map<number, Assignment>>(new Map<number, Assignment>());
  const [selectedAssignments, setSelectedAssignments] = useState<number[]>([]);

  useEffect(() => {
    if (data) {
      const assignmentMap = new Map<number, Assignment>();

      data.forEach((assignment: Assignment) => {
        assignmentMap.set(assignment.id, assignment);
      });

      setAssignments(assignmentMap);

      const entryIds = entries.map((entry) => entry.content_id);
      setSelectedAssignments([...selectedAssignments, ...entryIds]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- There will be an infinite render loop if the other dependencies are added
  }, [data]);

  const unselectedAssignments = useMemo(() => {
    return [...assignments.values()].filter((ass) => {
      return !selectedAssignments.some((sel) => sel === ass.id);
    });
  }, [assignments, selectedAssignments]);

  const options = useMemo(
    () =>
      unselectedAssignments.map((ass) => ({
        value: ass.id,
        label: ass.title,
      })),
    [unselectedAssignments],
  );

  const tableData: AssignmentTableType[] = useMemo(() => {
    return selectedAssignments.map((selectedAss) => {
      const ass = assignments.get(selectedAss);
      const entry = entries.find((e) => e.content_id === selectedAss);

      return {
        id: entry ? entry.content_id : -1,
        name: ass ? ass.title : 'No title found',
        isPublished: ass ? ass.published : false,
        gradingType: ass ? ass.grading_type : GradingType.NotGraded,
        weight: entry ? entry.weight : 0,
      };
    });
  }, [assignments, entries, selectedAssignments]);

  const onAdd = useCallback(
    (id: number) => {
      const ass = assignments.get(id);
      if (ass) {
        onChange([
          ...entries,
          {
            title: ass.title,
            tile_id: -1,
            weight: 0,
            content_id: id,
          },
        ]);
      }
    },
    [assignments, entries, onChange],
  );

  const onWeightChange = useCallback(
    (id: number, weight: number) => {
      const entry = entries.find((e) => e.content_id === id);
      if (entry) {
        const updatedEntry = { ...entry, weight: weight / 100 };
        const updatedEntries = entries.map((e) => (e.content_id === id ? updatedEntry : e));
        onChange(updatedEntries);
      }
    },
    [entries, onChange],
  );

  return (
    <div className='space-y-4'>
      <Select
        disabled={isError || isLoading}
        onValueChange={(value) => {
          onAdd(Number(value));
          setSelectedAssignments([...selectedAssignments, Number(value)]);
        }}
      >
        <SelectTrigger className='max-w-80'>
          <SelectValue placeholder='Select an assignment' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Assignments</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className='space-y-1'>
        <FormLabel>Currently added assignments</FormLabel>
        <DataTable columns={columns} data={tableData} isError={isError} onWeightChange={onWeightChange} />
      </div>
    </div>
  );
}

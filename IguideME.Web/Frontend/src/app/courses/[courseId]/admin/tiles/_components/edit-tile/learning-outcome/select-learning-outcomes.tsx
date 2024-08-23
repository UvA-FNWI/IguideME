'use client';

import { type ReactElement, useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getLearningGoals } from '@/api/entry';
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
import type { LearningGoal, TileEntry } from '@/types/tile';

import { columns, type LearningOutcomeTableType } from './columns';
import { DataTable } from './data-table';

export function SelectLearningOutcomes({
  entries,
  onChange,
}: {
  entries: TileEntry[];
  onChange: (event: TileEntry[]) => void;
}): ReactElement {
  const { data: goals, isError, isLoading } = useQuery({ queryKey: ['learning-goals'], queryFn: getLearningGoals });

  const [selectedGoals, setSelectedGoals] = useState<number[]>(entries.map((entry) => entry.content_id));

  const unselectedGoals: LearningGoal[] = useMemo(() => {
    if (!goals) return [];
    return [...goals.values()].filter((top) => {
      return !selectedGoals.some((sel) => sel === top.id);
    });
  }, [goals, selectedGoals]);

  const options = useMemo(
    () =>
      unselectedGoals.map((goal) => ({
        value: goal.id,
        label: goal.title,
      })),
    [unselectedGoals],
  );

  const tableData: LearningOutcomeTableType[] = useMemo(() => {
    if (!goals) return [];

    return selectedGoals.map((selectedGoal) => {
      const topic = goals.find((g) => g.id === selectedGoal);
      return {
        name: topic ? topic.title : 'Title not found',
        requirements: topic ? topic.requirements.length : 0,
      };
    });
  }, [goals, selectedGoals]);

  const onAdd = useCallback(
    (id: number) => {
      if (!goals) return;

      const goal = goals.find((g) => g.id === id);
      if (goal) {
        onChange([
          ...entries,
          {
            title: goal.title,
            tile_id: -1,
            weight: 0,
            content_id: id,
          },
        ]);
      }
    },
    [entries, onChange, goals],
  );

  return (
    <div className='space-y-4'>
      <Select
        disabled={isError || isLoading}
        onValueChange={(value) => {
          onAdd(Number(value));
          setSelectedGoals([...selectedGoals, Number(value)]);
        }}
      >
        <SelectTrigger className='max-w-80'>
          <SelectValue placeholder='Select an learning outcome' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Learning Outcomes</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className='space-y-1'>
        <FormLabel>Currently added learning outcomes</FormLabel>
        <DataTable columns={columns} data={tableData} isError={isError} />
      </div>
    </div>
  );
}

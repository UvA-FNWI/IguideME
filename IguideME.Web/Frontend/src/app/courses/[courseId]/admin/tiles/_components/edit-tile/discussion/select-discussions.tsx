'use client';

import { type ReactElement, useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getTopics } from '@/api/entry';
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
import type { DiscussionTopic, TileEntry } from '@/types/tile';

import { columns, type DiscussionTableType } from './columns';
import { DataTable } from './data-table';

export function SelectDiscussions({
  entries,
  onChange,
}: {
  entries: TileEntry[];
  onChange: (event: TileEntry[]) => void;
}): ReactElement {
  const { data: topics, isError, isLoading } = useQuery({ queryKey: ['topics'], queryFn: getTopics });

  const [selectedTopics, setSelectedTopics] = useState<number[]>(entries.map((entry) => entry.content_id));

  const unselectedTopics: DiscussionTopic[] = useMemo(() => {
    if (!topics) return [];
    return [...topics.values()].filter((top) => {
      return !selectedTopics.some((sel) => sel === top.id);
    });
  }, [topics, selectedTopics]);

  const options = useMemo(
    () =>
      unselectedTopics.map((topic) => ({
        value: topic.id,
        label: topic.title,
      })),
    [unselectedTopics],
  );

  const tableData: DiscussionTableType[] = useMemo(() => {
    if (!topics) return [];

    return selectedTopics.map((selectedTopic) => {
      const topic = topics.find((t) => t.id === selectedTopic);
      return {
        name: topic ? topic.title : 'Title not found',
        author: topic ? topic.author : 'Author not found',
        date: topic ? topic.date : 0,
      };
    });
  }, [topics, selectedTopics]);

  const onAdd = useCallback(
    (id: number) => {
      if (!topics) return;

      const topic = topics.find((t) => t.id === id);
      if (topic) {
        onChange([
          ...entries,
          {
            title: topic.title,
            tile_id: -1,
            weight: 0,
            content_id: id,
          },
        ]);
      }
    },
    [entries, onChange, topics],
  );

  return (
    <div className='space-y-4'>
      <Select
        disabled={isError || isLoading}
        onValueChange={(value) => {
          onAdd(Number(value));
          setSelectedTopics([...selectedTopics, Number(value)]);
        }}
      >
        <SelectTrigger className='max-w-80'>
          <SelectValue placeholder='Select an discussion' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Discussions</SelectLabel>
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
        <DataTable columns={columns} data={tableData} isError={isError} />
      </div>
    </div>
  );
}

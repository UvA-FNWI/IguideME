'use client';

import React, { type ReactElement, useEffect, useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

import { Button } from './button';
import { Card, CardContent } from './card';
import { Checkbox } from './checkbox';
import { ScrollArea } from './scroll-area';

interface TransferlistItem {
  id: string;
  label: string;
}

interface TransferlistProps {
  initialLeftItems?: TransferlistItem[];
  initialRightItems?: TransferlistItem[];

  onValueChange?: (value: number[]) => void;
}

export function Transferlist({ initialLeftItems, initialRightItems, onValueChange }: TransferlistProps): ReactElement {
  const [leftItems, setLeftItems] = useState<TransferlistItem[]>([]);
  const [rightItems, setRightItems] = useState<TransferlistItem[]>([]);

  useEffect(() => {
    if (initialLeftItems) setLeftItems(initialLeftItems);
  }, [initialLeftItems]);

  useEffect(() => {
    if (initialRightItems) setRightItems(initialRightItems);
  }, [initialRightItems]);

  useEffect(() => {
    if (onValueChange) {
      onValueChange(rightItems.map((item) => parseInt(item.id, 10)));
    }
  }, [onValueChange, rightItems]);

  const [selectedLeft, setSelectedLeft] = useState<string[]>([]);
  const [selectedRight, setSelectedRight] = useState<string[]>([]);

  const moveToRight = (): void => {
    const itemsToMove = leftItems.filter((item) => selectedLeft.includes(item.id));
    setRightItems([...rightItems, ...itemsToMove]);
    setLeftItems(leftItems.filter((item) => !selectedLeft.includes(item.id)));
    setSelectedLeft([]);
  };

  const moveToLeft = (): void => {
    const itemsToMove = rightItems.filter((item) => selectedRight.includes(item.id));
    setLeftItems([...leftItems, ...itemsToMove]);
    setRightItems(rightItems.filter((item) => !selectedRight.includes(item.id)));
    setSelectedRight([]);
  };

  const handleCheckboxChange = (id: string, list: 'left' | 'right'): void => {
    if (list === 'left') {
      setSelectedLeft((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    } else {
      setSelectedRight((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    }
  };

  const renderList = (items: TransferlistItem[], selected: string[], list: 'left' | 'right'): ReactElement => (
    <ScrollArea className='h-[200px] w-[200px] rounded-md border p-4'>
      {items.map((item) => (
        <div key={item.id} className='mb-2 flex items-center space-x-2'>
          <Checkbox
            id={`${list}-${item.id}`}
            checked={selected.includes(item.id)}
            onChange={() => {
              handleCheckboxChange(item.id, list);
            }}
          />
          <label
            htmlFor={`${list}-${item.id}`}
            className='truncate text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            {item.label}
          </label>
        </div>
      ))}
    </ScrollArea>
  );

  return (
    <Card className='w-full border-none'>
      <CardContent className='!p-0'>
        <div className='flex items-center justify-between'>
          {renderList(leftItems, selectedLeft, 'left')}
          <div className='flex flex-col space-y-2'>
            <Button variant='outline' size='icon' onClick={moveToRight} disabled={selectedLeft.length === 0}>
              <ArrowRightIcon className='h-4 w-4' />
              <span className='sr-only'>Move to right</span>
            </Button>
            <Button variant='outline' size='icon' onClick={moveToLeft} disabled={selectedRight.length === 0}>
              <ArrowLeftIcon className='h-4 w-4' />
              <span className='sr-only'>Move to left</span>
            </Button>
          </div>
          {renderList(rightItems, selectedRight, 'right')}
        </div>
      </CardContent>
    </Card>
  );
}

export type { TransferlistItem };

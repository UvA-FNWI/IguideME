'use client';

import { type FC, memo, type ReactElement, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/cn';
import type { User } from '@/types/user';

const Autocomplete: FC<Readonly<{ isError: boolean; students?: User[] }>> = memo(
  ({ isError, students }): ReactElement => {
    const [open, setOpen] = useState<boolean>(false);
    const path = usePathname();
    const router = useRouter();

    return (
      <Command className='h-fit w-full max-w-[400px]'>
        <CommandInput
          placeholder="Enter a student's name or search..."
          onBlur={() => {
            setOpen(false);
          }}
          onFocus={() => {
            setOpen(true);
          }}
        />
        <div className='mt-1'>
          <div
            className={cn(
              'absolute w-full max-w-[400px] rounded-xl bg-background outline-none animate-in fade-in-0 zoom-in-95',
              open ? 'block' : 'hidden',
            )}
          >
            <CommandList>
              <CommandEmpty className='rounded-md border border-muted dark:border-foreground'>
                {isError ? 'Error: Failed to retrieve students' : 'No students found.'}
              </CommandEmpty>
              {students ?
                <CommandGroup className='rounded-md border border-muted dark:border-foreground' heading='All students'>
                  {students.map((student) => (
                    <CommandItem
                      className='flex w-full items-center gap-2'
                      key={student.userID}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        router.push(`${path}/students/${student.userID}`);
                      }}
                      onSelect={() => {
                        router.push(`${path}/students/${student.userID}`);
                      }}
                    >
                      {student.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              : null}
            </CommandList>
          </div>
        </div>
      </Command>
    );
  },
);
Autocomplete.displayName = 'Autocomplete';
export { Autocomplete };

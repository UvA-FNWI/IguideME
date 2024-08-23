'use client';

import { type FC, memo, type ReactElement, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from './ui/button';
import { Label } from './ui/label';
import { Skeleton } from './ui/skeleton';
import { Switch } from './ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ThemeSwitcherProps {
  side?: 'top' | 'right' | 'bottom' | 'left';
  variant?: 'full' | 'compact';
}

const ThemeSwitcher: FC<ThemeSwitcherProps> = memo(({ side = 'right', variant = 'full' }): ReactElement => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (variant === 'full') {
    return (
      <div className='flex h-full w-full items-center justify-between px-4 py-3'>
        <Label htmlFor='theme-switcher'>Toggle theme</Label>
        {mounted ?
          <Switch
            id='theme-switcher'
            checked={theme === 'dark'}
            onCheckedChange={() => {
              setTheme(theme === 'dark' ? 'light' : 'dark');
            }}
          />
        : <Skeleton className='h-6 w-11' />}
      </div>
    );
  }

  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          {mounted ?
            <Button
              aria-label='Switch theme'
              className='h-full w-full'
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
              }}
              variant='outline'
            >
              {theme === 'dark' ?
                <Sun />
              : <Moon />}
            </Button>
          : <Skeleton className='h-11 w-14' />}
        </TooltipTrigger>
        {mounted ?
          <TooltipContent side={side}>Switch theme</TooltipContent>
        : null}
      </Tooltip>
    </TooltipProvider>
  );
});
ThemeSwitcher.displayName = 'ThemeSwitcher';

export { ThemeSwitcher };

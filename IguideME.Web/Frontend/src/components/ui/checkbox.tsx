import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react';

import { cn } from '@/lib/cn';

type CheckboxProps = ComponentPropsWithoutRef<'input'>;

const Checkbox = forwardRef<ElementRef<'input'>, CheckboxProps>(({ className, checked, id, ...props }, ref) => {
  return (
    <div className='!m-0'>
      <label
        className='block size-7 cursor-pointer rounded-md border-2 border-solid border-foreground transition-all duration-200 ease-in active:scale-105 active:rounded-xl peer-focus:scale-[1.03]'
        htmlFor={id}
      >
        <input
          className={cn('peer absolute opacity-0', className)}
          checked={checked}
          id={id}
          ref={ref}
          type='checkbox'
          {...props}
        />
        <svg className='pointer-events-none p-[5%]' viewBox='0,0,50,50'>
          <path
            className='fill-none stroke-foreground transition-all duration-300'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={4}
            strokeDasharray={100}
            strokeDashoffset={checked ? 0 : 101}
            d='M5 30 L 20 45 L 45 5'
          />
        </svg>
      </label>
    </div>
  );
});
Checkbox.displayName = 'Checkbox';
export { Checkbox };

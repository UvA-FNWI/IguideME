import type { ReactElement } from 'react';

export function NavigationSkip(): ReactElement {
  return (
    <a
      href='#main-content'
      className='absolute left-0 right-0 ml-auto mr-auto mt-2 w-44 -translate-y-[200%] rounded-full bg-background p-1 text-center outline-primary transition-transform focus:translate-y-0'
    >
      Skip to main content
    </a>
  );
}

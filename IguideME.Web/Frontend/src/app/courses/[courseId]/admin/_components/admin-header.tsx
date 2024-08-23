import type { ReactElement } from 'react';

import { Separator } from '@/components/ui/separator';

interface AdminHeaderProps {
  title: string;
  subtitle: string | ReactElement;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps): ReactElement {
  return (
    <header className='mb-8 w-full'>
      <h1 className='text-2xl font-bold lg:text-3xl'>{title}</h1>
      <p className='mb-4 mt-2 text-lg text-muted-foreground'>{subtitle}</p>
      <Separator orientation='horizontal' />
    </header>
  );
}

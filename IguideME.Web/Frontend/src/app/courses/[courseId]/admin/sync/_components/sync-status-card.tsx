import type { ReactElement } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { JobStatus } from '@/types/sync';

interface SyncStatusCardProps {
  description: string;
  status: JobStatus;
  title: string;
}

const statusColors = new Map<string, string>([
  [JobStatus.Errored, 'bg-destructive hover:bg-destructive'],
  [JobStatus.Pending, 'bg-warning hover:bg-warning'],
  [JobStatus.Processing, 'bg-yellow-500 hover:bg-yellow-500'],
  [JobStatus.Success, 'bg-success hover:bg-success'],
  [JobStatus.Unknown, 'bg-muted-foreground hover:bg-muted-foreground'],
]);

export function SyncStatusCard({ description, status, title }: SyncStatusCardProps): ReactElement {
  return (
    <Card className='min-w-72'>
      <CardHeader className='!py-2'>
        <CardTitle className='flex items-center justify-between text-base'>
          <span>{title}</span>
          <Badge className={statusColors.get(status) ?? 'bg-muted-foreground hover:bg-muted-foreground'}>
            {status}
          </Badge>
        </CardTitle>
        <CardDescription>{description === '' ? 'No description' : description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

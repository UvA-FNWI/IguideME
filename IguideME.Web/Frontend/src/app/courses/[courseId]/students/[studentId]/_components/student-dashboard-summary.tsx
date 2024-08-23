import type { ReactElement } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UpdatesDisplay } from '@/components/updates-display';

import { PredictedGradeGraph } from './predicted-grade-graph';

export function StudentDashboardSummary(): ReactElement {
  return (
    <div className='flex flex-col gap-8'>
      <PredictedGradeGraph />
      <Card>
        <CardHeader>
          <CardTitle>Latest updates</CardTitle>
          <CardDescription>
            This section provides the latest updates on your academic performance, comparing your grades to those of
            your peers. Stay informed about how you are performing relative to your peers in various tasks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpdatesDisplay />
        </CardContent>
      </Card>
    </div>
  );
}

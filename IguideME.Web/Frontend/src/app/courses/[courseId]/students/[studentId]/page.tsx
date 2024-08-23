import type { ReactElement } from 'react';

import { StudentDashboardTabsWrapper } from './_components/student-dashboard-tabs-wrapper';
import { StudentDashboardTileWrapper } from './_components/student-dashboard-tile/student-dashboard-tile-wrapper';

export default function StudentDashboard(): ReactElement {
  return (
    <div>
      <StudentDashboardTabsWrapper>
        <StudentDashboardTileWrapper />
      </StudentDashboardTabsWrapper>
    </div>
  );
}

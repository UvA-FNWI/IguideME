import type { ReactElement } from 'react';

import { AdminHeader } from '@/app/courses/[courseId]/admin/_components/admin-header';

export default function DataWizard(): ReactElement {
  return <AdminHeader title='Data Wizard' subtitle='Import and manage your data' />;
}

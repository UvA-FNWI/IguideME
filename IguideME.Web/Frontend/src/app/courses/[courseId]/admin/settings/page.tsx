import type { ReactElement } from 'react';

import { AdminHeader } from '@/app/courses/[courseId]/admin/_components/admin-header';

import { NotificationSettings } from './_components/notification-settings';
import { PeerSettings } from './_components/peer-settings';

export default function Settings(): ReactElement {
  return (
    <>
      <AdminHeader title='Settings' subtitle='Configure the general settings for this course.' />
      <PeerSettings />
      <NotificationSettings />
    </>
  );
}

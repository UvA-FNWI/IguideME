import AdminBlock from '@/components/atoms/admin-block/admin-block';
import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import CourseDetailSettings from '@/components/crystals/course-details-settings/course-details-settings';
// import AcceptListSettings from '@/components/crystals/accept-list-settings/accept-list-settings';
import NotificationSettings from '@/components/crystals/notification-settings/notification-settings';
import PeerSettings from '@/components/crystals/peer-settings/peer-settings';
import { type FC, type ReactElement } from 'react';

const AdminSettings: FC = (): ReactElement => {
  return (
    <div>
      <AdminTitle title='Settings' description='Configure the general settings for this course.' />

      <AdminBlock title='Peer groups'>
        <PeerSettings />
      </AdminBlock>

      {/* <AdminBlock title='Accept list'>
        <AcceptListSettings />
      </AdminBlock> */}
      <AdminBlock title='Notifications'>
        <NotificationSettings />
      </AdminBlock>

      <AdminBlock title='Course details'>
        <CourseDetailSettings />
      </AdminBlock>
    </div>
  );
};

export default AdminSettings;

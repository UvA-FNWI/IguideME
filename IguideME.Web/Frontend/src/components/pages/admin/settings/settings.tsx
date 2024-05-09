import AdminBlock from '@/components/atoms/admin-block/admin-block';
import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
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
      <AdminBlock title='Notifications'>
        <NotificationSettings />
      </AdminBlock>
    </div>
  );
};

export default AdminSettings;

import { useState, type FC, type ReactElement } from 'react';
import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import { Segmented } from 'antd';
import { AppstoreOutlined, BellOutlined, FileDoneOutlined, SettingOutlined } from '@ant-design/icons';
import CommonTable from './common-table';

export const enum GradeTableType {
  settings,
  tile,
  entry,
  notifications,
}

const StudentOverview: FC = (): ReactElement => {
  const [selectedTableType, setSelectedTableType] = useState<GradeTableType>(0);

  return (
    <div className='flex flex-col'>
      <AdminTitle description='An overview of students grades and consent.' title='Student Overview' />
      <div className='my-3 flex w-full justify-center'>
        <Segmented
          className='custom-segmented w-fit !bg-surface2'
          options={[
            { label: 'Settings', value: GradeTableType.settings, icon: <SettingOutlined /> },
            { label: 'Tile', value: GradeTableType.tile, icon: <AppstoreOutlined /> },
            { label: 'Entry', value: GradeTableType.entry, icon: <FileDoneOutlined /> },
            { label: 'Notifications', value: GradeTableType.notifications, icon: <BellOutlined /> },
          ]}
          value={selectedTableType}
          onChange={(value) => {
            setSelectedTableType(value);
          }}
        />
      </div>
      <CommonTable type={selectedTableType} />
    </div>
  );
};

export default StudentOverview;

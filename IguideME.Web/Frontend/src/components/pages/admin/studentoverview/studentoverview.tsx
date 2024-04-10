import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import GradesTable from '@/components/crystals/grades-table/grades-table';
import SettingsTable from '@/components/crystals/consent-table/consent-table';
import { Divider } from 'antd';
import { type FC, type ReactElement } from 'react';

const StudentOverview: FC = (): ReactElement => {
  return (
    <div>
      <AdminTitle description='An overview of students grades and consent.' title='Student Overview' />
      <SettingsTable />
      <Divider />
      <GradesTable />
    </div>
  );
};

export default StudentOverview;

import { getCourseNotifications, getStudentsWithSettings } from '@/api/users';
import QueryError from '@/components/particles/QueryError';
import { useQuery } from '@tanstack/react-query';
import { Table } from 'antd';
import { FC, ReactElement } from 'react';
import { useAntFilterDropdown } from './AntFilterDropdown';
import { User } from '@/types/user';
import { GradeTableType } from './studentoverview';
import { getSettingsColumns, getSettingsData } from './settings';
import { getNotificationColumns, getNotificationData } from './notifications';
import { getTiles } from '@/api/tiles';
import { getTileColumns, getTileData } from './tiles';
import { getAllEntryGrades, getAllUserTileGrades } from '@/api/grades';
import { getEntryColumns, getEntryData } from './entries';

export interface CommonData {
  key: string;
  student: User;
  name: string;
}

interface Props {
  type: GradeTableType;
}

const CommonTable: FC<Props> = ({ type }): ReactElement => {
  const {
    data: students,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['students', 'settings'],
    queryFn: getStudentsWithSettings,
  });

  const {
    data: notifications,
    // isNotificationError,
    // isNotificationLoading,
  } = useQuery({
    queryKey: ['course-notifications'],
    queryFn: async () => await getCourseNotifications(),
    enabled: type === GradeTableType.notifications,
  });

  const {
    data: tiles,
    // isTileError,
    // isTileLoading,
  } = useQuery({
    queryKey: ['tiles'],
    queryFn: async () => await getTiles(),
    enabled: type === GradeTableType.tile || type === GradeTableType.entry,
  });

  const {
    data: tile_grades,
    // isTileGradesError,
    // isTileGradesLoading,
  } = useQuery({
    queryKey: ['tile-grades'],
    queryFn: async () => await getAllUserTileGrades(),
    enabled: type === GradeTableType.tile,
  });

  const {
    data: entry_grades,
    // isEntryGradesError,
    // isEntryGradesLoading,
  } = useQuery({
    queryKey: ['entry-grades'],
    queryFn: async () => await getAllEntryGrades(),
    enabled: type === GradeTableType.entry,
  });

  const columns = [
    {
      key: 'name',
      title: 'Student' as any,
      dataIndex: 'name',
      fixed: true,
      width: '16vw',
      ...useAntFilterDropdown('name'),
      sorter: (a: CommonData, b: CommonData) => a.student.sortable_name.localeCompare(b.student.sortable_name),
    },
    ...getColumns(),
  ];

  if (isError) {
    return <QueryError className='top-20' title='Failed to fetch student data' />;
  }

  return (
    <div>
      <Table<CommonData & any>
        className='custom-table'
        columns={columns}
        dataSource={getData()}
        scroll={{ x: 'max-content', y: 600 }}
        loading={isLoading || !students}
        sticky
      />
    </div>
  );

  function getColumns() {
    switch (type) {
      case GradeTableType.settings:
        return getSettingsColumns();
      case GradeTableType.tile:
        return tiles ? getTileColumns(tiles) : [];
      case GradeTableType.entry:
        return tiles ? getEntryColumns(tiles) : [];
      case GradeTableType.notifications:
        return getNotificationColumns();
    }
  }

  function getData() {
    if (!students) {
      return [];
    }
    switch (type) {
      case GradeTableType.settings:
        return getSettingsData(students);
      case GradeTableType.tile:
        return getTileData(students, tile_grades);
      case GradeTableType.entry:
        return getEntryData(students, entry_grades);
      case GradeTableType.notifications:
        return getNotificationData(students, notifications);
    }
  }
};

export default CommonTable;

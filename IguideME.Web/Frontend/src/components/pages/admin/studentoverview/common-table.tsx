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
import { getErrorColumn } from './error-column';

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
    isError: isNotificationError,
    isLoading: isNotificationLoading,
  } = useQuery({
    queryKey: ['course-notifications'],
    queryFn: async () => await getCourseNotifications(),
    enabled: type === GradeTableType.notifications,
  });

  const {
    data: tiles,
    isError: isTileError,
    isLoading: isTileLoading,
  } = useQuery({
    queryKey: ['tiles'],
    queryFn: async () => await getTiles(),
    enabled: type === GradeTableType.tile || type === GradeTableType.entry,
  });

  const {
    data: tile_grades,
    isError: isTileGradesError,
    isLoading: isTileGradesLoading,
  } = useQuery({
    queryKey: ['tile-grades'],
    queryFn: async () => await getAllUserTileGrades(),
    enabled: type === GradeTableType.tile,
  });

  const {
    data: entry_grades,
    isError: isEntryGradesError,
    isLoading: isEntryGradesLoading,
  } = useQuery({
    queryKey: ['entry-grades'],
    queryFn: async () => await getAllEntryGrades(),
    enabled: type === GradeTableType.entry,
  });

  const columns = [
    {
      key: 'name',
      title: 'Student',
      dataIndex: 'name',
      fixed: true,
      width: '16vw',
      ...useAntFilterDropdown('name'),
      sorter: (a: CommonData, b: CommonData) => a.student.sortable_name.localeCompare(b.student.sortable_name),
    },
    ...getColumns(),
  ];

  if (isError) {
    return (
      <div className='flex flex-col'>
        <QueryError className='top-20' title='Failed to fetch student data' />
      </div>
    );
  }

  return (
    <div>
      <Table<CommonData & any>
        className='custom-table'
        columns={columns}
        dataSource={getData()}
        scroll={{ x: 'max-content', y: 600 }}
        loading={
          isLoading ||
          !students ||
          isNotificationLoading ||
          isTileLoading ||
          isTileGradesLoading ||
          isEntryGradesLoading
        }
        sticky
      />
    </div>
  );

  function getColumns() {
    switch (type) {
      case GradeTableType.settings:
        return getSettingsColumns();
      case GradeTableType.tile:
        if (isTileError) return getErrorColumn('tiles');
        if (isTileGradesError) return getErrorColumn('tile grades');
        return tiles ? getTileColumns(tiles) : [];
      case GradeTableType.entry:
        if (isTileError) return getErrorColumn('tiles and entries');
        if (isEntryGradesError) return getErrorColumn('entry grades');
        return tiles ? getEntryColumns(tiles) : [];
      case GradeTableType.notifications:
        if (isNotificationError) return getErrorColumn('notifications');
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
        return getTileData(
          students.filter((student) => student.settings?.consent === 1),
          tile_grades,
        );
      case GradeTableType.entry:
        return getEntryData(
          students.filter((student) => student.settings?.consent === 1),
          entry_grades,
        );
      case GradeTableType.notifications:
        return getNotificationData(
          students.filter((student) => student.settings?.consent === 1),
          notifications,
        );
    }
  }
};

export default CommonTable;

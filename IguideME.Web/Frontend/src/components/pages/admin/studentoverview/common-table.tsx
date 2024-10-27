import { getCourseNotifications, getStudentsWithSettings } from '@/api/users';
import QueryError from '@/components/particles/QueryError';
import { useQuery } from '@tanstack/react-query';
import { Table } from 'antd';
import { type FC, type ReactElement } from 'react';
import { useAntFilterDropdown } from './AntFilterDropdown';
import { type User } from '@/types/user';
import { GradeTableType } from './studentoverview';
import { getSettingsColumns, getSettingsData, type SettingsData } from './settings';
import { getNotificationColumns, getNotificationData, type NotificationData } from './notifications';
import { getTiles } from '@/api/tiles';
import { getTileColumns, getTileData, type TileData } from './tiles';
import { getAllEntryGrades, getAllUserTileGrades } from '@/api/grades';
import { getEntryColumns, getEntryData, type EntryData } from './entries';
import type { ColumnsType } from 'antd/lib/table';

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
    isError: studentError,
    isLoading: studentLoading,
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

  console.log("notifications", notifications);

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
    data: tileGrades,
    isError: isTileGradesError,
    isLoading: isTileGradesLoading,
  } = useQuery({
    queryKey: ['tile-grades'],
    queryFn: async () => await getAllUserTileGrades(),
    enabled: type === GradeTableType.tile,
  });

  const {
    data: entryGrades,
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

  if (studentError || isNotificationError || isTileError || isTileGradesError || isEntryGradesError) {
    return (
      <div className='relative h-full w-full'>
        <QueryError title='Failed to load data' subTitle='Please refresh the page or try again later.' />
      </div>
    );
  }

  return (
    <div>
      <Table<CommonData & any>
        className='custom-table [&_td]:!whitespace-pre'
        columns={columns}
        dataSource={getData()}
        scroll={{ x: 'max-content', y: 600 }}
        loading={
          studentLoading || isNotificationLoading || isTileLoading || isTileGradesLoading || isEntryGradesLoading
        }
        sticky
      />
    </div>
  );

  function getColumns():
    | ColumnsType<CommonData & SettingsData>
    | ColumnsType<CommonData & EntryData>
    | ColumnsType<CommonData & TileData> {
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

  function getData():
    | Array<CommonData & SettingsData>
    | Array<CommonData & TileData>
    | Array<CommonData & NotificationData> {
    if (!students) {
      return [];
    }
    switch (type) {
      case GradeTableType.settings:
        return getSettingsData(students);
      case GradeTableType.tile:
        return getTileData(
          students,
          (tileGrades ?? []).map((grade) => ({
            ...grade,
            tileGrades: grade.tile_grades,
          })),
        );
      case GradeTableType.entry:
        return getEntryData(students, entryGrades);
      case GradeTableType.notifications:
        return getNotificationData(
          students.filter((student) => student.settings?.consent === 1),
          notifications,
        );
    }
  }
};

export default CommonTable;

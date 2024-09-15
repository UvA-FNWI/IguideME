import { GradingType, type Submission } from '@/types/grades';
import type { Tile, TileEntry } from '@/types/tile';
import { Button, Drawer, Space, Table } from 'antd';
import { useState, type FC } from 'react';
import DataViewer from './data-viewer';
import type { ColumnsType } from 'antd/lib/table';
import Swal from 'sweetalert2';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteTileEntry, getTileSubmissions } from '@/api/tiles';
import type { User } from '@/types/user';
// @ts-expect-error -- Has no declaration file
import compute from 'compute.io';

interface HistoricUploadsProps {
  tile: Tile;
  entries: TileEntry[];
  students: User[];
}

const HistoricUploads: FC<HistoricUploadsProps> = ({ tile, entries, students }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [openEntry, setOpenEntry] = useState<TileEntry | undefined>(undefined);

  const {
    data: submissions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['submissions'],
    queryFn: async () => await getTileSubmissions({ tileId: tile.id }),
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteTileEntry,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tiles'] });
    },
  });

  return (
    <div>
      <Drawer
        width='100%'
        open={open && openEntry !== undefined}
        onClose={() => {
          setOpen(false);
        }}
      >
        {students.length} students
        <DataViewer
          tileEntry={openEntry}
          students={students}
          submissions={submissions?.filter((s) => s.assignmentID === (openEntry ? openEntry.content_id : false)) ?? []}
        />
      </Drawer>

      <h3 className='mb-3 text-lg'>Historic Uploads</h3>
      <Table
        className='custom-table'
        columns={getColumns((entry: TileEntry) => {
          setOpen(true);
          setOpenEntry(entry);
        }, mutate)}
        scroll={{ x: 1000 }}
        dataSource={formatData(tile, entries, submissions ?? [])}
      />
    </div>
  );
};
export default HistoricUploads;

const getColumns = (viewData: (obj: TileEntry) => any, mutate: (id: number) => void): ColumnsType<object> => {
  return [
    {
      title: 'Source name',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Rows',
      dataIndex: 'rows',
      key: 'rows',
    },
    {
      title: 'Average',
      dataIndex: 'average',
      key: 'average',
    },
    {
      title: 'Std. dev',
      dataIndex: 'stdev',
      key: 'stdev',
    },
    {
      title: 'Skewness',
      dataIndex: 'skewness',
      key: 'skewness',
      render: (value: number) => {
        return isNaN(value) ? '0' : value;
      },
    },
    {
      title: 'Actions',
      render: (_, object: any) => {
        return (
          <Space>
            <Button className='custom-default-button' onClick={() => viewData(object._rawEntry as TileEntry)}>
              View Data
            </Button>
            <Button
              className='custom-danger-button'
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={async () => {
                const result = await Swal.fire({
                  title: 'Do you really want to delete this data?',
                  text: `All data from "${object.title}" will be lost indefinitely!`,
                  icon: 'warning',
                  focusCancel: true,
                  showCancelButton: true,
                  confirmButtonText: 'Delete',
                  cancelButtonText: 'Cancel',
                  customClass: {
                    confirmButton: 'historicUploadConfirm',
                    cancelButton: 'historicUploadCancel',
                  },
                });

                if (result.value === true) {
                  mutate(Number(object._rawEntry.id));
                  await Swal.fire('Entries deleted!', '', 'success');
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                  await Swal.fire('Cancelled', 'The data has been preserved!', 'error');
                }
              }}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];
};

const formatData = (tile: Tile, entries: TileEntry[], submissions: Submission[]): any => {
  return entries.map((entry, i) => {
    const s = submissions.filter((x) => x.assignmentID === entry.content_id);
    const grades: number[] = s.map((x) => x.grades.grade);

    return {
      _rawEntry: entry,
      title: entry.title,
      key: i,
      rows: s.length,
      grades,
      binaryGrades: tile.gradingType === GradingType.PassFail,
      average: Math.round(compute.mean(grades) * 100) / 100,
      stdev: Math.round(compute.stdev(grades) * 100) / 100,
      skewness: Math.round(compute.skewness(grades) * 100) / 100,
    };
  });
};

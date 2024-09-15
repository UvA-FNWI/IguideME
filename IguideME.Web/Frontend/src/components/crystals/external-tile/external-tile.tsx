import type { Tile, TileGroup } from '@/types/tile';
import { Button, Skeleton, Tag } from 'antd';
import { useState, type FC } from 'react';
import UploadManager from '../upload-manager/upload-manager';
import HistoricUploads from '../historic-uploads/historic-uploads';
import { getStudentsByCourse } from '@/api/courses';
import { useRequiredParams } from '@/utils/params';
import { useQuery } from '@tanstack/react-query';
import QueryError from '@/components/particles/QueryError';

interface ExternalTileProps {
  tile: Tile;
  tileGroup: TileGroup;
}

const ExternalTile: FC<ExternalTileProps> = ({ tile, tileGroup }) => {
  const [uploadMenuOpen, setUploadMenuOpen] = useState<boolean>(false);

  const { courseId } = useRequiredParams(['courseId']);
  const {
    data: students,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['students', courseId],
    queryFn: async () => await getStudentsByCourse(courseId),
  });

  if (isLoading) {
    return (
      <Skeleton.Node active className='mb-5 !h-[420px] !w-full'>
        <div className='!h-[210px] !w-full lg:!h-[420px]' />
      </Skeleton.Node>
    );
  }

  return (
    <div className='border-border0 bg-surface2 rounded-md border border-solid px-8 pb-1 pt-4'>
      <div className='mb-5 flex items-center justify-between'>
        <h3 className='flex items-center gap-2 text-lg'>
          <b>{tile.title}</b> <Tag>{tileGroup.title}</Tag>
        </h3>
        {!uploadMenuOpen && (
          <Button
            className='custom-default-button ml-auto'
            onClick={() => {
              setUploadMenuOpen(true);
            }}
          >
            New Upload
          </Button>
        )}
      </div>

      {isError ?
        <QueryError className='relative' title='Failed to load students.' />
      : <>
          <div className='mb-5 flex'>
            {uploadMenuOpen && (
              <UploadManager
                students={students ?? []}
                tile={tile}
                closeUploadMenu={() => {
                  setUploadMenuOpen(false);
                }}
              />
            )}
          </div>
          <HistoricUploads tile={tile} entries={tile.entries} students={students ?? []} />
        </>
      }
    </div>
  );
};
export default ExternalTile;

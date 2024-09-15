import { AddDataWizardTile, getTileGroups, getTiles } from '@/api/tiles';
import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import ExternalTile from '@/components/crystals/external-tile/external-tile';
import QueryError from '@/components/particles/QueryError';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Select, Skeleton } from 'antd';
import { useState, type FC, type ReactElement } from 'react';

const DataWizard: FC = (): ReactElement => {
  const {
    data: tileGroups,
    isError: tileGroupError,
    isLoading: tileGroupLoading,
  } = useQuery({
    queryKey: ['tile-groups'],
    queryFn: getTileGroups,
  });

  const {
    data: tiles,
    isError: tileError,
    isLoading: tileLoading,
  } = useQuery({
    queryKey: ['tiles'],
    queryFn: getTiles,
  });

  const [selectedTile, setSelectedTile] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: AddDataWizardTile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tiles'] });
    },
  });

  if (tileGroupLoading || tileLoading) {
    return (
      <>
        <AdminTitle title='Data Wizard' description='Upload custom data into IguideME.' />
        <Skeleton.Node active className='mb-5 !h-[420px] !w-full'>
          <div className='!h-[210px] !w-full lg:!h-[420px]' />
        </Skeleton.Node>
        <Skeleton.Node active className='!h-[420px] !w-full'>
          <div className='!h-[210px] !w-full lg:!h-[420px]' />
        </Skeleton.Node>
      </>
    );
  } else if (tileGroupError || tileError) {
    return (
      <>
        <AdminTitle title='Data Wizard' description='Upload custom data into IguideME.' />
        <div className='relative'>
          <QueryError title='Failed to load data wizard.' />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminTitle title='Data Wizard' description='Upload custom data into IguideME.' />
      <div className='mb-12'>
        <h2 className='text-lg'>Add external data for a tile</h2>
        <div>
          <Select
            className='w-full max-w-60'
            placeholder='Select a tile'
            options={tiles?.map((g) => ({ label: g.title, value: g.id }))}
            value={selectedTile}
            onChange={(value) => {
              setSelectedTile(value);
            }}
          />
          <Button
            className='custom-default-button ml-2'
            disabled={isPending}
            onClick={() => {
              if (!selectedTile) return;
              mutate({ tileId: selectedTile, groupId: tiles?.find((t) => t.id === selectedTile)?.group_id ?? -1 });
            }}
          >
            Add Data Wizard
          </Button>
        </div>
      </div>
      <div className='flex flex-col space-y-12'>
        {tiles
          // Add a check to see if external data is added to the tilegroup. If not, don't display the tilegroup.
          ?.sort((a, b) => a.group_id * 100 + a.id - b.group_id * 100 - b.id)
          .map((t, i) => {
            const group = tileGroups?.find((g) => g.id === t.group_id);
            if (!group) return null;
            return (
              <div key={i}>
                <ExternalTile tile={t} tileGroup={group} />
              </div>
            );
          })}
      </div>
    </>
  );
};

export default DataWizard;

import type { ReactElement } from 'react';

import { getTiles } from '@/api/tiles';
import { type Tile, TileType } from '@/types/tile';
import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import { Card } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { SelectComparison } from './select-comparison';
import ComparisonView from '@/components/crystals/comparison-view/comparison-view';
import { useQuery } from '@tanstack/react-query';
import QueryLoading from '@/components/particles/QueryLoading';
import { useSearchParams } from 'react-router-dom';

interface CompareParams {
  tileAType: string;
  tileAId: string;
  tileBType: string;
  tileBId: string;
}

interface CompareTitles {
  a: string;
  b: string;
}

function parseSearchParams(searchParams: URLSearchParams): CompareParams | undefined {
  const a = searchParams.get('a');
  const b = searchParams.get('b');
  if (!a || !b) return undefined;

  const [tileAType, tileAId] = a.split('-');
  const [tileBType, tileBId] = b.split('-');

  if (!tileAType || !tileAId || !tileBType || !tileBId) {
    return undefined;
  }

  return {
    tileAType,
    tileAId,
    tileBType,
    tileBId,
  };
}

function findTitle(tiles: Tile[], type: string, id: string): string {
  if (type === 'tile') {
    return tiles.find((tile) => tile.id === Number(id))?.title ?? '';
  }

  return tiles.reduce<string>((acc, tile) => {
    if (
      (tile.type === TileType.assignments && type !== 'ass') ||
      (tile.type === TileType.discussions && type !== 'disc') ||
      (tile.type === TileType.learning_outcomes && type !== 'goal')
    ) {
      return acc;
    }

    const entry = tile.entries.find((e) => e.content_id === Number(id));
    return entry ? entry.title : acc;
  }, '');
}

function GradeAnalyzer(): ReactElement {
  const {
    data: tiles,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['tiles'],
    queryFn: getTiles,
  });

  const [searchParams] = useSearchParams();

  let titles: CompareTitles | undefined;
  const compareParams = parseSearchParams(searchParams);
  if (compareParams) {
    const titleA = findTitle(tiles ?? [], compareParams.tileAType, compareParams.tileAId);
    const titleB = findTitle(tiles ?? [], compareParams.tileBType, compareParams.tileBId);

    titles = {
      a: titleA,
      b: titleB,
    };
  }

  console.log('titles', titles);

  return (
    <>
      <AdminTitle title='Grade Analyzer' description='Analyze and compare tiles and assignments.' />
      <QueryLoading isLoading={isLoading}>
        <div className='space-y-8'>
          <Card size='small' title={<h2 className='text-lg'>Select two tiles or entries to compare</h2>}>
            {isError ?
              <div className='flex flex-col items-center justify-center gap-2'>
                <ExclamationCircleOutlined className='text-failure h-12 w-12' />
                <i className='text-failure text-base'>Error: Failed to retrieve the tiles and entries.</i>
              </div>
            : <SelectComparison
                defaultValues={
                  compareParams ?
                    [
                      `${compareParams.tileAType}-${compareParams.tileAId}`,
                      `${compareParams.tileBType}-${compareParams.tileBId}`,
                    ]
                  : undefined
                }
                tiles={tiles ?? []}
              />
            }
          </Card>

          <Card
            size='small'
            title={<h2 className='text-lg'>{compareParams ? 'Resulting comparison' : 'No comparison possible'}</h2>}
          >
            {compareParams && titles ?
              <ComparisonView compareParams={compareParams} compareTitles={titles} />
            : null}
          </Card>
        </div>
      </QueryLoading>
    </>
  );
}

export type { CompareParams, CompareTitles };
export default GradeAnalyzer;

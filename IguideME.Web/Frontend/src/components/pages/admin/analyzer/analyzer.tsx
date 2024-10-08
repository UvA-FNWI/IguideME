import { getCompareGrades } from '@/api/grades';
import { getTiles } from '@/api/tiles';
import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import Loading from '@/components/particles/loading';
import { TileType } from '@/types/tile';
import { useQuery } from '@tanstack/react-query';
import { Select } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { Dispatch, SetStateAction, useState, type FC, type ReactElement } from 'react';
import { CartesianGrid, Label, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis } from 'recharts';
import tailwindConfig from '@/../tailwind.config';
import resolveConfig from 'tailwindcss/resolveConfig';
import { varFixed } from '@/types/grades';

type ContentType = 'tile' | 'ass' | 'disc' | 'goal';
interface SelectionData {
  id: number;
  type: ContentType;
  title: string;
}

interface SelectProps {
  selected: SelectionData | undefined;
  setSelected: Dispatch<SetStateAction<SelectionData | undefined>>;
}

interface CompareProps {
  selectedA: SelectionData | undefined;
  selectedB: SelectionData | undefined;
}

interface GradesProps {
  data: Array<{ x: number; y: number }>;
  titleA: string;
  titleB: string;
}

const GradeAnalyzer: FC = (): ReactElement => {
  const [selectedA, setSelectedA] = useState<SelectionData>();
  const [selectedB, setSelectedB] = useState<SelectionData>();
  return (
    <div>
      <AdminTitle title='Grade Analyzer' description='Analyze and compare tiles and assignments.' />
      <div className='grid grid-cols-5'>
        <div className='col-span-5 flex items-center justify-center sm:col-span-2'>
          <SelectSource selected={selectedA} setSelected={setSelectedA} />
        </div>
        <div className='col-span-5 flex items-center justify-center sm:col-span-1'>to</div>
        <div className='col-span-5 flex items-center justify-center sm:col-span-2'>
          <SelectSource selected={selectedB} setSelected={setSelectedB} />
        </div>
      </div>
      {selectedA && selectedB && <Comparison selectedA={selectedA} selectedB={selectedB} />}
    </div>
  );
};

function Comparison({ selectedA, selectedB }: CompareProps) {
  const {
    data: gradesA,
    isError: isErrorA,
    isLoading: isLoadingA,
  } = useQuery({
    queryKey: ['g:' + selectedA?.id + selectedA?.type],
    queryFn: () => getCompareGrades(selectedA!.id, selectedA!.type),
    enabled: selectedA?.id !== -1,
    refetchOnWindowFocus: false,
  });

  const {
    data: gradesB,
    isError: isErrorB,
    isLoading: isLoadingB,
  } = useQuery({
    queryKey: ['g:' + selectedB?.id + selectedB?.type],
    queryFn: () => getCompareGrades(selectedB!.id, selectedB!.type),
    enabled: selectedB?.id !== -1,
    refetchOnWindowFocus: false,
  });

  if (isErrorA || isErrorB) return 'TODO:';
  if (isLoadingA || isLoadingB || !gradesA || !gradesB) return <></>;

  const data = gradesA
    .map((a) => {
      const b = gradesB.find((b) => b.userID === a.userID);
      return b ? { x: a.grade, y: b.grade } : undefined;
    })
    .filter((x) => x !== undefined);

  return (
    <>
      <ComparisonStatistics data={data} titleA={selectedA!.title} titleB={selectedB!.title} />
      <ComparisonScatter data={data} titleA={selectedA!.title} titleB={selectedB!.title} />
    </>
  );
}
function ComparisonStatistics({ data, titleA, titleB }: GradesProps) {
  titleA;
  titleB;
  let sum_x = 0;
  let sum_y = 0;
  let sum_xy = 0;
  let sum_xx = 0;
  let sum_yy = 0;
  let min_x = 100;
  let min_y = 100;
  let max_x = 0;
  let max_y = 0;
  const n = data.length;
  data.forEach(({ x, y }) => {
    sum_x += x;
    sum_y += y;
    sum_xy += x * y;
    sum_xx += x * x;
    sum_yy += y * y;
    min_x = min_x > x ? x : min_x;
    min_y = min_y > y ? y : min_y;
    max_x = max_x < x ? x : max_x;
    max_y = max_y < y ? y : max_y;
  });

  const r =
    (n * sum_xy - sum_x * sum_y) / (Math.sqrt(n * sum_xx - sum_x * sum_x) * Math.sqrt(n * sum_yy - sum_y * sum_y));
  const avg_x = sum_x / n;
  const avg_y = sum_y / n;
  const std_x = Math.sqrt(data.reduce((sum, { x }) => sum + (x - avg_x) * (x - avg_x), 0) / (n - 1));
  const std_y = Math.sqrt(data.reduce((sum, { y }) => sum + (y - avg_y) * (y - avg_y), 0) / (n - 1));

  return (
    <>
      r={r.toFixed(5)}, avg_x={varFixed(avg_x)}, avg_y={varFixed(avg_y)}, size = {n}, std_x = {varFixed(std_x)}, std_y ={' '}
      {varFixed(std_y)}, min_x= {varFixed(min_x)}, min_y = {varFixed(min_y)}, max_x= {varFixed(max_x)}, max_y ={' '}
      {varFixed(max_y)}
    </>
  );
}
function ComparisonScatter({ data, titleA, titleB }: GradesProps) {
  const fullConfig = resolveConfig(tailwindConfig);

  return (
    <div className='flex items-center justify-center'>
      <ResponsiveContainer width='40%' aspect={1}>
        <ScatterChart
          margin={{
            top: 30,
            right: 10,
            bottom: 30,
            left: 10,
          }}
        >
          <CartesianGrid />
          <XAxis type='number' dataKey='x' name={titleA}>
            <Label value={titleA} position='bottom' offset={0} />
          </XAxis>
          <YAxis type='number' dataKey='y' name={titleB}>
            <Label value={titleB} angle={270} position='left' offset={0} />
          </YAxis>
          <Scatter name='Comparison' data={data} fill={fullConfig.theme.colors.primary} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
  // <Tooltip cursor={{ strokeDasharray: '3 3' }} />
}

const SelectSource: FC<SelectProps> = ({ selected, setSelected }): ReactElement => {
  const {
    data: tiles,
    isError: isTilesError,
    isLoading: isTilesLoading,
  } = useQuery({
    queryKey: ['tiles'],
    queryFn: getTiles,
  });

  if (isTilesError) {
    return <>TODO</>;
  }

  const onChange = (val: number, option: DefaultOptionType) => {
    val;
    setSelected(option.data);
  };

  const options: DefaultOptionType[] = [
    {
      label: <span> Tiles </span>,
      title: 'tiles',
      key: 'g1',
      options: tiles?.map((tile) => ({
        label: <span>{tile.title}</span>,
        value: 'tile' + tile.id,
        data: { id: tile.id, type: 'tile', title: tile.title },
        key: 'tile' + tile.id,
      })),
    },
    {
      label: <span> Entries </span>,
      title: 'entries',
      key: 'g2',
      options: tiles?.reduce<DefaultOptionType[]>((acc, tile) => {
        tile.entries.forEach((entry) => {
          if (acc.find((x) => x.value === entry.content_id)) {
            return acc;
          }
          let data;
          let key;
          switch (tile.type) {
            case TileType.assignments:
              data = { type: 'ass', id: entry.content_id, title: entry.title };
              key = 'ass' + entry.content_id;
              break;
            case TileType.discussions:
              data = { type: 'disc', id: entry.content_id, title: entry.title };
              key = 'disc' + entry.content_id;
              break;
            case TileType.learning_outcomes:
              data = { type: 'goal', id: entry.content_id, title: entry.title };
              key = 'goal' + entry.content_id;
              break;
          }

          acc.push({
            label: <span>{entry.title}</span>,
            value: key,
            key: key,
            data: data,
          });
        });
        return acc;
      }, []),
    },
  ];

  return (
    <>
      <Select
        className='[&>div]:!border-accent/70 [&>div]:!bg-surface1 [&>div]:hover:!border-accent [&>div]:hover:!bg-surface2 [&_span]:!text-text w-4/5 [&>div]:!shadow-none'
        onChange={onChange}
        options={tiles && options}
        value={(selected ? selected.type + selected.id : '') as any}
        placeholder='Select a source of grades'
        notFoundContent={
          isTilesLoading ?
            <div className='h-20 pt-10'>
              <Loading />
            </div>
          : 'Empty'
        }
      />
    </>
  );
};

export default GradeAnalyzer;

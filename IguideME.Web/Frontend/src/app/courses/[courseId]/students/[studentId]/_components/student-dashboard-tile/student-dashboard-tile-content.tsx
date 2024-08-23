'use client';

import { type FC, memo, useCallback, useMemo } from 'react';
import { Angry, Mail, Meh, Smile, Trophy } from 'lucide-react';
import { Bar, BarChart, Legend, PolarAngleAxis, RadialBar, RadialBarChart, XAxis, YAxis } from 'recharts';
import { useShallow } from 'zustand/react/shallow';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';
import { useTileViewStore } from '@/stores/tile-view-store';
import { GradingType, printGrade, type Tile, type TileGrades, TileType } from '@/types/tile';

interface StudentDashboardTileContentProps {
  grades: TileGrades;
  tile: Tile;
}

const StudentDashboardTileContent: FC<StudentDashboardTileContentProps> = memo(({ grades, tile }) => {
  const { viewType } = useTileViewStore(useShallow((state) => ({ viewType: state.viewType })));

  if (tile.type === TileType.Assignments && tile.gradingType === GradingType.NotGraded) {
    return (
      <div className='flex h-[180px] w-[250px] flex-col items-center justify-center gap-2'>
        <Smile className='h-12 w-12' />
        <i className='text-base text-muted-foreground'>This tile is not graded</i>
      </div>
    );
  } else if (viewType === 'graph') {
    return <StudentDashboardTileGraph grades={grades} tile={tile} />;
  } else if (viewType === 'grid') {
    return <StudentDashboardTileGrid grades={grades} tile={tile} />;
  }
});
StudentDashboardTileContent.displayName = 'StudentDashboardTileContent';

const StudentDashboardTileGraph: FC<StudentDashboardTileContentProps> = memo(({ grades, tile }) => {
  const chartData = useMemo(() => {
    return [
      {
        name: 'You',
        grade: grades.grade,
        peerMin: 0,
        peerMax: 0,
        fill: 'hsl(var(--chart-1))',
      },
      {
        name: 'Peer',
        grade: grades.peerAvg,
        peerMin: grades.peerMin,
        peerMax: grades.peerMax,
        fill: 'hsl(var(--chart-2))',
      },
    ];
  }, [grades]);

  const renderChart = useCallback(() => {
    switch (tile.type) {
      case TileType.LearningOutcomes:
        return (
          <RadialBarChart
            accessibilityLayer
            data={chartData}
            cx='50%'
            cy='50%'
            innerRadius='40%'
            outerRadius='100%'
            barSize={50}
            startAngle={0}
            endAngle={-270}
          >
            <RadialBar background className='[&>g>path]:!fill-muted' dataKey='grade' />
            <Legend align='right' layout='vertical' verticalAlign='top' />
            <PolarAngleAxis type='number' domain={[0, 100]} angleAxisId={0} tick={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
          </RadialBarChart>
        );
      default:
        return (
          <BarChart accessibilityLayer data={chartData}>
            <XAxis dataKey='name' xAxisId={0} />
            <XAxis dataKey='name' xAxisId={1} hide />
            <YAxis type='number' dataKey='grade' domain={[0, 100]} hide />
            <Bar
              background={{ fill: '#eee' }}
              barSize={70}
              className='[&>g>path]:!fill-muted'
              dataKey={({ peerMin, peerMax }: { peerMin: number; peerMax: number }) => [peerMin, peerMax]}
              opacity={0.2}
              xAxisId={0}
            />
            <Bar barSize={50} dataKey='grade' xAxisId={1} />
            <ChartTooltip content={<ChartTooltipContent />} cursor={{ className: '!fill-transparent' }} />
          </BarChart>
        );
    }
  }, [chartData, tile.type]);

  return (
    <ChartContainer config={{}} className='h-[180px] w-[250px]'>
      {renderChart()}
    </ChartContainer>
  );
});
StudentDashboardTileGraph.displayName = 'StudentDashboardTileGraph';

const StudentDashboardTileGrid: FC<StudentDashboardTileContentProps> = memo(({ grades, tile }) => {
  const { grade, peerMin, peerAvg, peerMax, max, type } = {
    grade: grades.grade,
    peerMin: grades.peerMin,
    peerAvg: grades.peerAvg,
    peerMax: grades.peerMax,
    max: grades.max,
    type: tile.gradingType,
  };

  const renderContent = useCallback(() => {
    if (grade === 0) return 'No grade yet';

    const emotion =
      grade < 50 ? <Angry />
      : grade >= peerAvg || (max === -1 && grade > 0) ? <Smile />
      : <Meh />;

    switch (tile.type) {
      case TileType.Assignments:
        return (
          <div className='flex flex-col items-center justify-center gap-2'>
            {emotion}
            <p className='text-lg'>{printGrade(type, grade, max)}</p>
          </div>
        );
      case TileType.Discussions:
        return (
          <div className='flex flex-col items-center justify-center gap-2'>
            <Mail />
            <p className='text-lg'>{((grade * max) / 100).toFixed(0)}</p>
          </div>
        );
      case TileType.LearningOutcomes:
        return (
          <div className='flex flex-col items-center justify-center gap-2'>
            <Trophy />
            <p className='text-lg'>{printGrade(type, grade, max)}</p>
          </div>
        );
      default:
        return null;
    }
  }, [grade, max, peerAvg, tile.type, type]);

  const renderPeerComparison = useCallback(
    () => (
      <div className='flex items-center justify-center gap-8'>
        {['min', 'avg', 'max'].map((label, index) => {
          const value = [peerMin, peerAvg, peerMax][index];
          return (
            <div key={label} className='flex flex-col items-center justify-center gap-1'>
              <p className='text-center text-xs'>
                {label}.
                <br />
                {printGrade(type, value ?? 0, max, false)}
              </p>
            </div>
          );
        })}
      </div>
    ),
    [max, peerAvg, peerMax, peerMin, type],
  );

  return (
    <div className='flex h-[180px] w-[250px] flex-col items-center justify-between'>
      <div className='grid grow place-content-center'>{renderContent()}</div>
      <div className='w-full shrink-0'>
        <Separator className='w-full' orientation='horizontal' />
        <div className='w-full pt-1 text-center'>
          <span className='text-xs font-semibold'>Peer Comparison</span>
          {renderPeerComparison()}
        </div>
      </div>
    </div>
  );
});
StudentDashboardTileGrid.displayName = 'StudentDashboardTileGrid';

export { StudentDashboardTileContent };

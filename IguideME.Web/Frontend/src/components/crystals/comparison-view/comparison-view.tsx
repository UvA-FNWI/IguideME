import type { ReactElement } from 'react';

import { GradeCorrelation } from './grade-correlation';
import { PassRate } from './pass-rate';
import { useQuery } from '@tanstack/react-query';
import type { CompareParams, CompareTitles } from '@/components/pages/admin/analyzer/analyzer';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getCompareGrades } from '@/api/grades';
import { Tabs, type TabsProps } from 'antd';
import QueryLoading from '@/components/particles/QueryLoading';

export default function ComparisonView({
  compareParams,
  compareTitles,
}: {
  compareParams: CompareParams;
  compareTitles: CompareTitles;
}): ReactElement {
  const {
    data: gradesA,
    isError: isErrorA,
    isLoading: isLoadingA,
  } = useQuery({
    queryKey: ['g:' + Number(compareParams.tileAId) + compareParams.tileAType],
    queryFn: async () => await getCompareGrades(Number(compareParams.tileAId), compareParams.tileAType),
    enabled: Number(compareParams.tileAId) !== -1,
    refetchOnWindowFocus: false,
  });

  const {
    data: gradesB,
    isError: isErrorB,
    isLoading: isLoadingB,
  } = useQuery({
    queryKey: ['g:' + compareParams.tileBId + compareParams.tileBType],
    queryFn: async () => await getCompareGrades(Number(compareParams.tileBId), compareParams.tileBType),
    enabled: Number(compareParams.tileBId) !== -1,
    refetchOnWindowFocus: false,
  });

  const items: TabsProps['items'] = [
    {
      key: 'correlation',
      label: 'Grade correlation',
      children:
        isErrorA || isErrorB ?
          <div className='flex flex-col items-center justify-center gap-2'>
            <ExclamationCircleOutlined className='h-12 w-12 text-failure' />
            <i className='text-base text-failure'>Error: Failed to retrieve the grades.</i>
          </div>
        : <GradeCorrelation gradesA={gradesA ?? []} gradesB={gradesB ?? []} compareTitles={compareTitles} />,
    },
    {
      key: 'passRate',
      label: 'Pass rate',
      children:
        isErrorA || isErrorB ?
          <div className='flex flex-col items-center justify-center gap-2'>
            <ExclamationCircleOutlined className='h-12 w-12 text-failure' />
            <i className='text-base text-failure'>Error: Failed to retrieve the grades.</i>
          </div>
        : <PassRate gradesA={gradesA ?? []} gradesB={gradesB ?? []} compareTitles={compareTitles} />,
    },
  ];

  return (
    <QueryLoading isLoading={isLoadingA || isLoadingB}>
      <Tabs className='course-selection-tabs' defaultActiveKey='correlation' items={items} />
    </QueryLoading>
  );
}

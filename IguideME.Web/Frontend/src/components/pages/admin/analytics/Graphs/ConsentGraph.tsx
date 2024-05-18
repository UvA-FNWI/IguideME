import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip as AntToolTip } from 'antd';
import { FC, memo } from 'react';
import { Bar, BarChart, Label, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type ConsentGraphProps = {
  consentInfo?: { consent: number; total: number };
};

const ConsentGraph: FC<ConsentGraphProps> = memo(({ consentInfo }) => {
  const tooltipInfo =
    'This graph shows the number of students who have given consent to use ' +
    'their data and the number of students who have not given consent.';

  return (
    <div
      className='grid h-[400px] w-[400px] grid-rows-2 rounded-md bg-card-foreground p-4'
      style={{ gridTemplateRows: 'auto 1fr' }}
    >
      <div className='mb-4 flex max-h-fit w-full items-center justify-between'>
        <h2 className='h-fit text-xl'>Consent Information</h2>
        <AntToolTip placement='bottom' title={tooltipInfo}>
          <QuestionCircleOutlined className='text-xl text-success' />
        </AntToolTip>
      </div>
      <div className='h-full w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={[
              { name: 'Consent', value: consentInfo ? consentInfo.consent : 0, fill: 'red' },
              { name: 'No Consent', value: consentInfo ? consentInfo.total - consentInfo.consent : 0, fill: 'blue' },
            ]}
          >
            <XAxis axisLine dataKey='name' type='category' />
            <YAxis axisLine domain={[0, consentInfo ? consentInfo.total : 0]} type='number'>
              <Label value='Number of Students' position='insideStart' angle={-90} dx={-10} />
            </YAxis>
            <Bar dataKey='value' background={{ fill: '#636363' }} />
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
ConsentGraph.displayName = 'ConsentGraph';
export default ConsentGraph;

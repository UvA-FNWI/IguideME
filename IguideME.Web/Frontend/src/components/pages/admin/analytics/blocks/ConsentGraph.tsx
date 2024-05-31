import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';
import { type FC, memo } from 'react';

interface ConsentGraphProps {
  consentInfo?: { current_consent: number; prev_consent: number; total: number };
}

const ConsentGraph: FC<ConsentGraphProps> = memo(({ consentInfo }) => {
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <RadialBarChart
        data={[
          {
            name: 'Consent',
            value: consentInfo ? Math.round((consentInfo.current_consent / consentInfo.total) * 100) : 0,
            fill: '#fc5f5f',
          },
        ]}
        cx='50%'
        cy='50%'
        innerRadius='70%'
        outerRadius='100%'
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <RadialBar
          background={{ fill: '#f4f4f4' }}
          dataKey={'value'}
          isAnimationActive={false}
          label={(props) => {
            const value = props.value;
            return (
              <text x='50%' y='55%' className='fill-text text-sm font-black' textAnchor='middle'>
                {value}%
              </text>
            );
          }}
        />
        <PolarAngleAxis type='number' domain={[0, 100]} angleAxisId={0} tick={false} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
});
ConsentGraph.displayName = 'ConsentGraph';
export default ConsentGraph;

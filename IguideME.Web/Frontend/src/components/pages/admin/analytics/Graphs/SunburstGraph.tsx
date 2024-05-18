import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip as AntToolTip } from 'antd';
import { FC, memo, useEffect, useMemo, useRef } from 'react';
import Sunburst from 'sunburst-chart';
import { SessionData } from '../analytics';

type SunburstGraphProps = {
  sessions: Map<string, SessionData[]>;
};

type TreeType = {
  name: string;
  children: TreeType[];
  value: number;
};

const SunburstGraph: FC<SunburstGraphProps> = memo(({ sessions }) => {
  const tree: TreeType = useMemo(() => {
    const root: TreeType = {
      name: 'Opened IguideME',
      children: [],
      value: sessions.size,
    };

    Array.from(sessions.values()).forEach((session) => {
      let currentNode = root;
      let depth: number = 0;

      session.slice(1).forEach((event: SessionData) => {
        if (depth >= 6) return;

        const currentAction = event.action_detail;
        // Check if a child node with the current action already exists
        let childNode = currentNode.children.find((child: TreeType) => child.name === currentAction);
        if (childNode) {
          childNode.value++;
        } else {
          childNode = { name: currentAction, value: 1, children: [] };
          currentNode.children.push(childNode);
        }

        currentNode = childNode;
        depth++;
      });
    });

    return root;
  }, [sessions]);

  const tooltipInfo =
    'This graph shows the user navigation path analysis. ' +
    'The root node is the number of sessions opened. ' +
    'The children nodes are the actions taken by the user.';

  return (
    <div
      className='bg-overlay0 grid h-[400px] w-[400px] grid-rows-2 rounded-md p-4'
      style={{ gridTemplateRows: 'auto 1fr' }}
    >
      <div className='mb-4 flex max-h-fit w-full items-center justify-between'>
        <h2 className='h-fit text-xl'>User Navigation Path Analysis</h2>
        <AntToolTip placement='bottom' title={tooltipInfo}>
          <QuestionCircleOutlined className='text-xl text-success' />
        </AntToolTip>
      </div>

      <SunburstChart {...tree} />
    </div>
  );
});
SunburstGraph.displayName = 'SunburstGraph';
export default SunburstGraph;

const SunburstChart: FC<TreeType> = memo((tree) => {
  function nameToColor(name: string): string {
    // Generate a color based on the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  }

  const chartDrawnRef = useRef<boolean>(false);
  const sunburstChartRef = useRef(null);
  useEffect(() => {
    if (tree.children.length === 0 || !sunburstChartRef.current || chartDrawnRef.current) return;

    const treeCopy = JSON.parse(JSON.stringify(tree));
    const myChart = Sunburst();
    myChart
      .width(300)
      .height(300)
      .data(treeCopy)
      .showLabels(false)
      .color((node) => nameToColor(node.name ?? ''))
      .maxLevels(5)(sunburstChartRef.current);
    chartDrawnRef.current = true;
  }, [tree]);

  return (
    <div className='[&>div]:grid [&>div]:!h-full [&>div]:!w-full [&>div]:place-content-center' ref={sunburstChartRef} />
  );
});
SunburstChart.displayName = 'SunburstGraph';

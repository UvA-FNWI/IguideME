import Sunburst from 'sunburst-chart';
import { type FC, memo, useEffect, useMemo, useRef } from 'react';
import { type SessionData } from '../analytics';

/**
 * Generates a color based on the name
 * @param name The name to generate the color for
 * @returns A color in hex format
 */
function nameToColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);

  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
}

interface SunburstGraphProps {
  sessions: Map<string, SessionData[]>;
}

interface TreeType {
  name: string;
  children: TreeType[];
  value: number;
}

const SunburstGraph: FC<SunburstGraphProps> = memo(({ sessions }) => {
  const tree: TreeType = useMemo(() => {
    const root: TreeType = {
      name: 'Opened IguideME',
      children: [],
      value: 0,
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

  return <SunburstChart {...tree} />;
});
SunburstGraph.displayName = 'SunburstGraph';
export default SunburstGraph;

const SunburstChart: FC<TreeType> = memo((tree) => {
  const chartDrawnRef = useRef<boolean>(false);
  const sunburstChartRef = useRef(null);
  useEffect(() => {
    // eslint-disable-next-line
    if (tree.children.length === 0 || !sunburstChartRef.current || chartDrawnRef.current) return;

    const treeCopy: TreeType = JSON.parse(JSON.stringify(tree));
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

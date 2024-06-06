import Sunburst from 'sunburst-chart';
import { ActionTypes } from '@/utils/analytics';
import { type FC, memo, useEffect, useMemo, useRef } from 'react';
import { type SessionData } from '../analytics';

/**
 * typeToColor converts an action type to a color.
 * @param type The type of action to convert to a color.
 * @returns The color corresponding to the given action type.
 */
function typeToColor(type: ActionTypes): string {
  switch (type) {
    case ActionTypes.page:
      return '#6f4e7c';
    case ActionTypes.tile:
      return '#0b84a5';
    case ActionTypes.tileView:
      return '#f6c85f';
    case ActionTypes.theme:
      return '#9dd866';
    case ActionTypes.notifications:
      return '#ca472f';
    case ActionTypes.settingChange:
      return '#ffa056';
    default:
      return '#8dddd0';
  }
}

interface SunburstGraphProps {
  sessions: Map<string, SessionData[]>;
}

interface TreeType {
  name: string;
  children: TreeType[];
  value: number;
  type: ActionTypes;
}

const SunburstGraph: FC<SunburstGraphProps> = memo(({ sessions }) => {
  const sortChildren = (node: TreeType): void => {
    node.children.sort((a, b) => a.type - b.type);
    node.children.forEach(sortChildren);
  };

  const tree: TreeType = useMemo(() => {
    const root: TreeType = {
      name: 'Opened IguideME',
      children: [],
      value: 0,
      type: ActionTypes.page,
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
          childNode = { name: currentAction, value: 1, children: [], type: event.action };
          currentNode.children.push(childNode);
        }

        currentNode = childNode;
        depth++;
      });
    });

    // Sort each layer by action type. The order is defined in the ActionTypes enum.
    sortChildren(root);

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
      .color((node) => typeToColor((node as TreeType).type ?? ActionTypes.page))
      .maxLevels(5)(sunburstChartRef.current)
      .tooltipTitle((node) => (node as TreeType).name);
    chartDrawnRef.current = true;
  }, [tree]);

  return (
    <div className='[&>div]:grid [&>div]:!h-full [&>div]:!w-full [&>div]:place-content-center' ref={sunburstChartRef} />
  );
});
SunburstChart.displayName = 'SunburstGraph';

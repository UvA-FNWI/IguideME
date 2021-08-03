import React, { Component } from "react";
import { Group } from '@visx/group';
import { hierarchy, Tree } from '@visx/hierarchy';
import { LinearGradient } from '@visx/gradient';
import { ParentSize } from '@visx/responsive';
import { data, defaultMargin } from "./helpers";
import getLinkComponent from "./linkcomponent";

export default class ApplicationAnalytics extends Component {
  render(): React.ReactNode {
    const margin = defaultMargin;

    return (
      <div style={{ width: '100%' }}>
        <ParentSize>
          { size => {
            const width = Math.max(size.width, 400);
            const height = 500;

            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;

            let sizeWidth = innerHeight;
            let sizeHeight = innerWidth;
            let origin: { x: number; y: number } = { x: 0, y: 0 };

            const LinkComponent = getLinkComponent({
              layout: "cartesian", linkType: "diagonal", orientation: "horizontal"
            });

            return (
              <svg width={width} height={height}>
                <LinearGradient id="links-gradient" from="#fd9b93" to="#fe6e9e" />
                <rect width={width} height={height} rx={14} fill="#272b4d" />
                <Group top={margin.top} left={margin.left}>
                  <Tree
                    root={hierarchy(data, d => (d.isExpanded ? null : d.children))}
                    size={[sizeWidth, sizeHeight]}
                    separation={(a, b) => (a.parent === b.parent ? 1 : 0.5) / a.depth}
                  >
                    { tree => (
                      <Group top={origin.y} left={origin.x}>
                        { tree.links().map((link, i) => {
                          return (
                            <LinkComponent
                              key={i}
                              data={link}
                              percent={0.5}
                              stroke="rgb(254,110,158,0.6)"
                              strokeWidth="10"
                              fill="none"
                            />
                          )
                        })}

                        { tree.descendants().map((node, key) => {
                          const width = 80;
                          const height = 30;

                          let top: number;
                          let left: number;

                          top = node.x;
                          left = node.y;

                          return (
                            <Group top={top} left={left} key={key}>
                              {node.depth === 0 && (
                                <circle
                                  r={12}
                                  fill="url('#links-gradient')"
                                  onClick={() => {
                                    node.data.isExpanded = !node.data.isExpanded;
                                    console.log(node);
                                    this.forceUpdate();
                                  }}
                                />
                              )}
                              {node.depth !== 0 && (
                                <rect
                                  height={height}
                                  width={width}
                                  y={-height / 2}
                                  x={-width / 2}
                                  fill="#272b4d"
                                  stroke={node.data.children ? '#03c0dc' : '#26deb0'}
                                  strokeWidth={1}
                                  strokeDasharray={node.data.children ? '0' : '2,2'}
                                  strokeOpacity={node.data.children ? 1 : 0.6}
                                  rx={node.data.children ? 0 : 10}
                                  onClick={() => {
                                    node.data.isExpanded = !node.data.isExpanded;
                                    console.log(node);
                                    this.forceUpdate();
                                  }}
                                />
                              )}
                              <text
                                dy=".33em"
                                fontSize={9}
                                fontFamily="Arial"
                                textAnchor="middle"
                                style={{ pointerEvents: 'none' }}
                                fill={node.depth === 0 ? '#71248e' : node.children ? 'white' : '#26deb0'}
                              >
                                {node.data.name}
                              </text>
                            </Group>
                          );
                        })}
                      </Group>
                    )}
                  </Tree>
                </Group>
              </svg>
            )
          }}
        </ParentSize>
      </div>
    )
  }
}
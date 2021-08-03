import React, { Component } from "react";
import { ParentSize } from '@visx/responsive';
import { Arc } from '@visx/shape';
import { Group } from '@visx/group';
import { Chord, Ribbon } from '@visx/chord';
import { scaleOrdinal } from '@visx/scale';
import { LinearGradient } from '@visx/gradient';

const pink = '#ff2fab';
const orange = '#ffc62e';
const purple = '#dc04ff';
const purple2 = '#7324ff';
const red = '#d04376';
const green = '#52f091';
const blue = '#04a6ff';
const lime = '#00ddc6';
const bg = '#e4e3d8';

const dataMatrix = [
  [11975, 5871, 8916, 2868, 4229],
  [1951, 10048, 2060, 6171, 3021],
  [8010, 16145, 8090, 8045, 312],
  [1013, 990, 940, 6907, 9210],
  [4201, 3992, 3912, 6329, 5302]
];

function descending(a: number, b: number): number {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

const color = scaleOrdinal<number, string>({
  domain: [0, 1, 2, 3, 4],
  range: ['url(#gpinkorange)', 'url(#gpurplered)', 'url(#gpurplegreen)', 'url(#gbluelime)', 'url(#gtest)'],
});

export default class TileTraffic extends Component {
  render(): React.ReactNode {
    const colors = ["blue", "red", "orange", "green", "pink"];
    let colorCombos: string[][] = [];

    for (let i = 0; i < colors.length - 1; i++) {
      // This is where you'll capture that last value
      colorCombos.push([colors[i], colors[i]]);
      for (let j = i + 1; j < colors.length; j++) {
        colorCombos.push([colors[i], colors[j]]);
        colorCombos.push([colors[j], colors[i]]);
      }
    }

    return (
      <div style={{width: '100%'}}>
        <ParentSize>
          { (parent) => {
            const centerSize = 10;
            const height = ((parent.width || 200)) / 2;
            const width = ((parent.width || 200));

            const outerRadius = Math.min(width, height) * 0.5 - (centerSize + 10);
            const innerRadius = outerRadius - centerSize;

            console.log(colorCombos);
            return (
              <svg width={width} height={height}>
                { colorCombos.map(([from, to]) =>
                  <LinearGradient id={"g" + from + to} from={from} to={to} vertical={false} />
                )}

                <rect width={width} height={height} fill={bg} rx={14} />
                <Group top={height / 2} left={width / 2}>
                  <Chord matrix={dataMatrix} padAngle={0.05} sortSubgroups={descending}>
                    {(master) => (
                      <g>
                        { master.chords.groups.map((group, i) => {
                          return (
                            <Arc
                              key={`key-${i}`}
                              data={group}
                              innerRadius={innerRadius}
                              outerRadius={outerRadius}
                              fill={colors[i]}//color(i)}//color(i)}
                              onClick={() => {
                              }}
                            />
                          )
                        })}
                        { master.chords.map((chord, i) => {
                          return (
                            <Ribbon
                              key={`ribbon-${i}`}
                              chord={chord}
                              radius={innerRadius}
                              fill={`url(#g${colors[chord.source.index]}${colors[chord.target.index]})`}
                              fillOpacity={0.75}
                              onClick={() => {
                                alert(`${chord.source.index}/${chord.target.index}`);
                              }}
                            />
                          );
                        })}
                      </g>
                    )}
                  </Chord>
                </Group>
              </svg>
            )
          }}
        </ParentSize>
      </div>
    )
  }
}

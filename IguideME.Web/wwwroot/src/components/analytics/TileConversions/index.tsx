import React, { Component } from "react";
import { BarStack } from '@visx/shape';
import { Group } from '@visx/group';
import { Grid } from '@visx/grid';
import { AxisBottom } from '@visx/axis';
import { ParentSize } from '@visx/responsive';
import {getColorScale, getDateScale, getTemperatureScale} from "./helpers";
import moment from "moment";
import {Select} from "antd";

const purple1 = '#6c5efb';
const purple2 = '#c998ff';
const purple3 = '#a44afe';
const background = '#eaedff';
const margin = { top: 40, right: 0, bottom: 0, left: 0 };

const data = [
  { date: moment().add(0, "days"), "Quizzes": "100", "Perusall": "83" },
  { date: moment().add(1, "days"), "Quizzes": "104", "Perusall": "63" },
  { date: moment().add(2, "days"), "Quizzes": "140", "Perusall": "98" },
  { date: moment().add(3, "days"), "Quizzes": "170", "Perusall": "112" },
  { date: moment().add(4, "days"), "Quizzes": "130", "Perusall": "120" },
  { date: moment().add(5, "days"), "Quizzes": "120", "Perusall": "140" },
  { date: moment().add(6, "days"), "Quizzes": "180", "Perusall": "195" },
]

export default class TileConversions extends Component {
  render(): React.ReactNode {
    return (
      <div style={{width: '100%'}}>
        <Select
          mode="multiple"
          allowClear
          style={{ marginBottom: 20, width: 300 }}
          placeholder="Please select"
          defaultValue={['quizzes', 'perusall']}
          onChange={() => {}}
        >
          <Select.Option value={'quizzes'}>
            Quizzes
          </Select.Option>
          <Select.Option value={'perusall'}>
            Perusall
          </Select.Option>
        </Select>

        <ParentSize>
          { (parent) => {
            const width = parent.width;
            const height = 500;

            const xMax = width;
            const yMax = height - margin.top - 100;
            const keys = Object.keys(data[0]).filter(x => x !== 'date');

            const temperatureTotals = data.reduce((allTotals, currentDate: any) => {
              const totalTemperature = keys.reduce((dailyTotal, k) => {
                dailyTotal += Number(currentDate[k]);
                return dailyTotal;
              }, 0);
              allTotals.push(totalTemperature);
              return allTotals;
            }, [] as number[]);

            const dateScale = getDateScale(data);
            const temperatureScale = getTemperatureScale(temperatureTotals);
            const colorScale = getColorScale(keys, [purple1, purple2, purple3]);

            dateScale.rangeRound([0, xMax]);
            temperatureScale.range([yMax, 0]);
            return (
              <svg width={width} height={height}>
                <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />


                <Group top={margin.top}>

                </Group>
                <AxisBottom
                  top={yMax + margin.top}
                  scale={dateScale}
                  tickFormat={(d: any) => d}
                  stroke={purple3}
                  tickStroke={purple3}
                  tickLabelProps={() => ({
                    fill: purple3,
                    fontSize: 11,
                    textAnchor: 'middle',
                  })}
                />
              </svg>
            )
          }}
        </ParentSize>
      </div>
    )
  }
}
import React, { Component } from "react";
import { SizeMe } from 'react-sizeme'
import { genPoints, genPolygonPoints, getDescriptionAnchor } from "./helpers";
import { IProps } from "./types";
import { scaleLinear } from '@visx/scale';
import { Group } from '@visx/group';
import { Point } from '@visx/point';
import { Line } from '@visx/shape';
import { Tile } from "../../../models/app/Tile";
import "./style.scss";

const silver = '#d9d9d9';
const orange = '#ff9933';
const pumpkin = '#f5810c';

export default class TileRadar extends Component<IProps> {

    render(): React.ReactNode {
        const { tilesGradeSummary, peerGrades } = this.props;

        // const degrees = 360;
        const margin = { top: 50, left: 75, right: 75, bottom: 50 }

        return (
            <div id={"tileRadial"}>
                <h2 style={{ textAlign: 'center' }}>What requires my attention?</h2>
                <br />
                <div style={{ width: '100%' }}>
                    <SizeMe monitorWidth={true} refreshMode={'throttle'} refreshRate={40}>
                        {({ size }) => {
                            if ((size.width || 0) < 50 || !size.width) {
                                return <span>Can't display radar</span>;
                            }

                            const xMax = size.width - margin.left - margin.right;
                            const yMax = size.width - margin.top - margin.bottom;
                            const radius = Math.min(xMax, yMax) / 2;

                            // const radialScale = scaleLinear<number>()
                                // .range([0, Math.PI * 2])
                                // .domain([degrees, 0]);

                            const genYScale = (value: number, tile: Tile) => {
                                const userGrades = tilesGradeSummary.filter(tgs => tgs.tile.id === tile.id);
                                const _peerGrades = peerGrades.filter(pg => pg.tileID === tile.id);

                                return scaleLinear<number>({
                                    range: [0, radius],
                                    domain: [0, tile.content === "BINARY" ?
                                        100 :
                                        Math.max(10, Math.max(...userGrades.map(x => x.average), ..._peerGrades.map(x => x.avg)))],
                                })(value);
                            }

                            // const webs = genAngles(tilesGradeSummary.length, degrees);
                            const zeroPoint = new Point({ x: 0, y: 0 });
                            const points = genPoints(tilesGradeSummary.length, radius);
                            const polygonPoints = genPolygonPoints(
                                tilesGradeSummary,
                                (n, tile) => genYScale(n, tile),
                                d => d.average
                            );

                            const peerPoints = genPolygonPoints(
                                [...tilesGradeSummary].map(d => {
                                    const target = peerGrades.find(p => p.tileID === d.tile.id);
                                    return {
                                        ...d,
                                        average: target?.avg ?? 0
                                    }
                                }), (n, tile) => genYScale(n, tile), d => d.average);

                            return (
                                <svg width={`${100}%`} height={`${size.width || 0}px`}>
                                    <rect width={`${size.width || 0}px`}
                                        height={`${size.width || 0}px`}
                                        fill={"#FAF7E9"}
                                        rx={14}
                                    />

                                    <Group top={size.width / 2 - margin.top} left={size.width / 2}>
                                        {[...new Array(tilesGradeSummary.length)].map((_, i) => (
                                            <Line key={`radar-line-${i}`}
                                                from={zeroPoint}
                                                to={points[i]}
                                                stroke={silver}
                                            />
                                        ))}

                                        <polygon
                                            opacity={1} // TODO: fade in?
                                            points={peerPoints.pointString}
                                            fill={'rgba(255, 0, 0, 0.3)'}
                                            fillOpacity={0.3}
                                            stroke={'red'}
                                            strokeWidth={1}
                                            style={{ transition: 'opacity .4s ease-in-out', zIndex: 90 }}
                                        />

                                        {peerPoints.points.map((point, i) => (
                                            <circle key={`peer-point-${i}`}
                                                cx={point.x}
                                                cy={point.y}
                                                r={2}
                                                opacity={1} // TODO: fade in?
                                                fill={'red'}
                                                style={{ transition: 'opacity .4s ease-in-out', zIndex: 90 }}
                                                onClick={() => {
                                                    window.dispatchEvent(new CustomEvent("selectTile", { detail: { tile: point.tile! } }))
                                                    //alert(point.tile!.title)
                                                }}
                                            />
                                        ))}

                                        {points.map((point, i) => (
                                            <React.Fragment key={i}>
                                                <Line key={`radar-line-${i}`}
                                                    from={i === 0 ? points[points.length - 1] : points[i - 1]}
                                                    to={points[i]}
                                                    stroke={silver}
                                                />
                                                { tilesGradeSummary[i === 0 ? tilesGradeSummary.length - 1 : i - 1].tile.title.split(" ").map((x, j) => (
                                                    <text x={point.x > 0 ? point.x + 10 : point.x - 10}
                                                        y={point.y > 0 ? point.y + 10 + (j * 12) : point.y - 10 - (j * 12)}
                                                        textAnchor={getDescriptionAnchor(point.x, point.y)}
                                                        style={{ whiteSpace: 'pre-wrap' }}
                                                        key={`$x:{x};j:${j}`}
                                                    >
                                                        { x}
                                                    </text>
                                                ))}
                                            </React.Fragment>
                                        ))}

                                        <polygon
                                            points={polygonPoints.pointString}
                                            fill={orange}
                                            fillOpacity={0.3}
                                            stroke={orange}
                                            strokeWidth={1}
                                            style={{ zIndex: 100 }}
                                        />

                                        {polygonPoints.points.map((point, i) => (
                                            <circle key={`radar-point-${i}`}
                                                cx={String(point.x)}
                                                cy={String(point.y)}
                                                r={4}
                                                fill={pumpkin}
                                                style={{ zIndex: 100 }}
                                                onClick={() => {
                                                    window.dispatchEvent(new CustomEvent("selectTile", { detail: { tile: point.tile! } }))
                                                    //alert(point.tile!.title)
                                                }}
                                            />
                                        ))}
                                    </Group>

                                    <circle cy={(size.width || 0) - 20} cx={20} fill={orange} r={5} />
                                    <text y={(size.width || 0) - 15} x={30}>
                                        You
                  </text>

                                    <circle cy={(size.width || 0) - 20} cx={80} fill={'red'} r={5} />
                                    <text y={(size.width || 0) - 15} x={90}>
                                        Peers
                  </text>
                                </svg>
                            );
                        }}
                    </SizeMe>
                </div>
            </div>
        )
    }
}

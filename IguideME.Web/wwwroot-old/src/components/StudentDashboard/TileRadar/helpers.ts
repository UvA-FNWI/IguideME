import { Tile } from "../../../models/app/Tile";
import TileController from "../../../api/controllers/tile";
import {TilesGradeSummary} from "../types";

const compute = require( 'compute.io' );

export const getTileAverage = async (tile: Tile, userID: string): Promise<number> => {
  const submissions = await TileController.getTileSubmissions(tile.id, userID).then(s => s);

  // For binary content types return the percentage of true values
  if (tile.content === "BINARY") {
    const success = submissions.filter(s => parseFloat(s.grade) > 0.1).length;
    const total = submissions.length;
    return Promise.resolve(
      (success / total) * 10
    );
  }

  const average = compute.mean(submissions.map(s => parseFloat(s.grade)));
  return Promise.resolve(average)
}

export const genAngles = (length: number, degrees: number) => {
  return [...new Array(length + 1)].map((_, i) => ({
    angle: i * (degrees / length),
  }));
}

export const genPoints = (length: number, radius: number) => {
  const step = (Math.PI * 2) / length;
  return [...new Array(length)].map((_, i) => ({
    x: radius * Math.sin(i * step),
    y: radius * Math.cos(i * step),
  }));
};

export const genPolygonPoints = (
  tilesGradeSummary: TilesGradeSummary[],
  getScale: (n: number, tile: Tile) => any,
  getValue: (d: { tile: Tile, average: number }) => number,
) => {
  const step = (Math.PI * 2) / tilesGradeSummary.length;
  const points: { x: number; y: number, tile: Tile | undefined }[] =
    new Array(tilesGradeSummary.length).fill({ x: 0, y: 0, tile: undefined });

  const pointString: string = new Array(tilesGradeSummary.length + 1).fill('').reduce((res, _, i) => {
    if (i > tilesGradeSummary.length) return res;

    const xVal = getScale(getValue(tilesGradeSummary[i - 1]), tilesGradeSummary[i - 1].tile) * Math.sin(i * step);
    const yVal = getScale(getValue(tilesGradeSummary[i - 1]), tilesGradeSummary[i - 1].tile) * Math.cos(i * step);
    points[i - 1] = { x: xVal, y: yVal, tile: tilesGradeSummary[i - 1].tile };
    res += `${xVal || 0},${yVal || 0} `;
    return res;
  });

  return { points, pointString };
}

export const getDescriptionAnchor = (x: number, y: number) => {
  if (x > 1) {
    return "start";
  } else if (x < -0.1) {
    return "end";
  }

  return "middle";
}

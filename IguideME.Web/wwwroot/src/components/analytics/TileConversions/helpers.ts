import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale";

const getDate = (d: any) => d.date.format("YYYY-MM-DD");

export const getDateScale = (data: any) => {
  return scaleBand<string>()
    .domain(data.map((d: any) => getDate(d)))
    .padding(0.2);
}

export const getTemperatureScale = (totals: number[]) => {
  return scaleLinear<number>()
    .domain([0, Math.max(...totals)])
    .nice();
}

export const getColorScale = (keys: string[], colors: string[]) => {
  return scaleOrdinal<string, string>()
    .domain(keys)
    .range(colors);
}
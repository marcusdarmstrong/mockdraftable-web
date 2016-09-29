// @flow

export type Point = {
  x: number,
  y: number,
};

export type MeasurablePercentile = {
  measurable: {
    id: number,
    name: string,
  },
  percentile: number,
};

export type MeasurablePercentilePoint = MeasurablePercentile & { point: Point };

export type GraphData = {
  points: MeasurablePercentilePoint[],
  factors: number[],
};

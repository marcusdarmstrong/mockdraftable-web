// @flow

import type { MeasurablePercentile, MeasurablePercentilePoint, GraphData } from './types/graphing';
import round from './util/round';

export default (percentiles: MeasurablePercentile[], scale: number): GraphData => {
  const angleIncrement = (2 * Math.PI) / percentiles.length;
  const startAngle = (3 * Math.PI) / 2;
  const points: MeasurablePercentilePoint[] = [];
  const factors = [];
  let i = 0;
  for (const percentile of percentiles) {
    const angle = startAngle + (i++ * angleIncrement);

    points.push(Object.assign({}, percentile, {
      point: {
        x: round(scale * Math.cos(angle), 2),
        y: round(scale * Math.sin(angle), 2),
      },
    }));
    factors.push(percentile.percentile / 100);
  }

  return {
    points,
    factors,
  };
};

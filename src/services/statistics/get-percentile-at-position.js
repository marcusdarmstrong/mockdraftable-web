// @flow

import { getByKey } from '../../measurables';
import type { PositionId, MeasurableKey, MeasurementStore } from '../../types/domain';
import { Units } from '../../types/domain';

// This'll do a binary search to establish the number of values in the sorted array that are
// strictly lower than the provided value.
const binarySearchLow = (arr, value) => {
  let high = arr.length - 1;
  let low = 0;
  let midpoint;
  while (high >= low) {
    // eslint-disable-next-line no-bitwise
    midpoint = (high + low) >> 1;
    if (arr[midpoint] < value) {
      low = midpoint + 1;
    } else {
      high = midpoint - 1;
    }
  }
  return low;
};

// Similarly, this will find the number of values in the sorted array that are lower or equal.
const binarySearchHigh = (arr, value) => {
  let high = arr.length - 1;
  let low = 0;
  let midpoint;
  while (high >= low) {
    // eslint-disable-next-line no-bitwise
    midpoint = (high + low) >> 1;
    if (arr[midpoint] > value) {
      high = midpoint - 1;
    } else {
      low = midpoint + 1;
    }
  }
  return low;
};

const getPercentileAtPosition = (measurementStore: MeasurementStore) =>
  (position: PositionId, measurableKey: MeasurableKey, measurement: number) => {
    const positionMeasurements = measurementStore.get(position);
    if (!positionMeasurements) {
      return 0;
    }

    const measurements = positionMeasurements.get(measurableKey);

    if (!measurements || measurements.length === 0) {
      return 0;
    }

    const countLower = binarySearchLow(measurements, measurement);
    const count = (measurements[countLower] === measurement) ?
      (binarySearchHigh(measurements, measurement) - countLower) : 0;

    if (getByKey(measurableKey).unit === Units.SECONDS) {
      return Math.round(
        (100 * (measurements.length - (countLower + (count / 2)))) / measurements.length,
      );
    }
    return Math.round((100 * (countLower + (count / 2))) / measurements.length);
  };

export default getPercentileAtPosition;

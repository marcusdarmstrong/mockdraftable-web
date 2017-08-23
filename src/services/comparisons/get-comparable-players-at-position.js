// @flow

import { round } from 'lodash';
import { allMeasurables } from '../../measurables';

import type { PlayerId, Id, PlayerStore, PositionEligibilityStore, PositionId, StatisticsStore, Measurable, MeasurableKey } from '../../types/domain';

type FixedSizeArrayNode<T> = {
  value: T,
  score: number,
};

class FixedSizeArray<T> {
  values: FixedSizeArrayNode<T>[];
  size: number;
  currentMaxScore: number;
  currentMaxIndex: number;

  constructor(size) {
    this.values = [];
    this.size = size;
    this.currentMaxScore = Number.POSITIVE_INFINITY;
    this.currentMaxIndex = -1;
  }

  push(value: T, score) {
    if (this.values.length < this.size) {
      this.values.push({ value, score });
      if (score > this.currentMaxScore) {
        this.currentMaxScore = score;
        this.currentMaxIndex = this.values.length - 1;
      }
      return true;
    } else if (score < this.currentMaxScore) {
      this.values[this.currentMaxIndex] = { value, score };
      this.currentMaxScore = score;
      this.values.forEach((val, index) => {
        if (val.score > this.currentMaxScore) {
          this.currentMaxScore = val.score;
          this.currentMaxIndex = index;
        }
      });
      return true;
    }
    return false;
  }
}

const zscore = (measurement, mean, stddev) => stddev === 0 ? 0 : (measurement - mean) / stddev;

const scale = distance => round(Math.max(1, 100 * Math.min((1 / distance) ** (1 / 7), 1)) - 1, 1);

const keyedMeasurements = (measurements): { [MeasurableKey]: number } => {
  const keyed = {};
  measurements.forEach(({ measurableKey, measurement }) => { keyed[measurableKey] = measurement; });
  return keyed;
};


const distance = (p1meas, p2meas, positionStats) =>
  (allMeasurables).reduce(
    (accum, measurable: Measurable) => {
      const { mean, stddev } = positionStats.get(measurable.key) || { mean: 0, stddev: 0 };
      const p1z = zscore(p1meas[measurable.key] || mean, mean, stddev);
      const p2z = zscore(p2meas[measurable.key] || mean, mean, stddev);
      return accum + ((p1z - p2z) ** 2);
    },
    0,
  );

const getComparablePlayersAtPosition =
  (
    playerStore: PlayerStore,
    statisticsStore: StatisticsStore,
    positionStore: PositionEligibilityStore,
  ) => (playerId: Id, positionId: PositionId, first: number, after: number = 0) => {
    const positionStats = statisticsStore.get(positionId);
    const players = positionStore.get(positionId);
    const basePlayer = playerStore.get(playerId);

    if (!positionStats || !players || !basePlayer) {
      return [];
    }

    const p1meas = keyedMeasurements(basePlayer.measurements);

    const bestAttempts: FixedSizeArray<PlayerId> = new FixedSizeArray(first + after);

    players.forEach((id) => {
      if (id !== playerId) {
        const { measurements } = playerStore.get(id) || { measurements: [] };
        bestAttempts.push(id, distance(p1meas, keyedMeasurements(measurements), positionStats));
      }
    });

    bestAttempts.values.splice(0, after);
    const r = bestAttempts.values.map(node => ({ playerId: node.value, score: scale(node.score) }));
    r.sort((a, b) => b.score - a.score);
    return r;
  };


export default getComparablePlayersAtPosition;

// @flow

export type Id = string;
export type PositionId = Id;
export type PlayerId = Id;
export type MeasurableId = Id;
export type Key = number;
export type MeasurableKey = Key;
export type PositionKey = Key;
export type PlayerKey = Key;

export const Sorts = {
  ASC: 'ASC',
  DESC: 'DESC',
};
export type Sort = $Keys<typeof Sorts>;

export type Color = string;

export const Units = {
  SECONDS: 'SECONDS',
  INCHES: 'INCHES',
  REPS: 'REPS',
  POUNDS: 'POUNDS',
};
export type Unit = $Keys<typeof Units>;
export const defaultSort = (unit: Unit): Sort => unit === Units.SECONDS ? Sorts.ASC : Sorts.DESC;

export const MeasurementSources = {
  COMBINE: 'COMBINE',
  PRODAY: 'PRODAY',
  WORKOUT: 'WORKOUT',
  OTHER: 'OTHER',
};
export type MeasurementSource = $Keys<typeof MeasurementSources>;

export type Measurement = {
  measurableKey: MeasurableKey,
  measurement: number,
  source: MeasurementSource,
};

export type PlayerPositions = {
  primary: PositionId,
  all: Array<PositionId>,
};

export type Player = {
  id: PlayerId,
  key: PlayerKey,
  name: string,
  draft: number,
  measurements: Array<Measurement>,
  positions: PlayerPositions,
  school?: string,
};

export const PositionTypes = {
  GROUP: 'GROUP',
  PRIMARY: 'PRIMARY',
  ROLE: 'ROLE',
};
export type PositionType = $Keys<typeof PositionTypes>;

export type Position = {
  id: PositionId,
  key: PositionKey,
  abbreviation: string,
  name: string,
  type: PositionType,
  color: Color,
  plural: string,
};

export type Measurable = {
  id: MeasurableId,
  key: MeasurableKey,
  name: string,
  unit: Unit,
};

export type Comparison = {
  playerId: PlayerId,
  score: number,
};

export type Comparisons = Array<Comparison>;

export type Percentile = {
  measurableKey: MeasurableKey,
  percentile: number,
};

export type Percentiles = Array<Percentile>;

export type DistributionStatistics = {
  count: number,
  mean: number,
  stddev: number,
};

export type PlayerStore = Map<PlayerId, Player>;
export type PositionEligibilityStore = Map<PositionId, Array<PlayerId>>;
export type StatisticsStore = Map<PositionId, Map<MeasurableKey, DistributionStatistics>>;
export type MeasurementStore = Map<PositionId, Map<MeasurableKey, Float32Array>>;

export type Stores = {
  playerStore: PlayerStore,
  positionEligibilityStore: PositionEligibilityStore,
  statisticsStore: StatisticsStore,
  measurementStore: MeasurementStore,
};

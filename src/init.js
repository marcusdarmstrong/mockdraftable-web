// @flow

import db from './connection';
import { getById, getByKey, getDefaultPosition } from './positions';
import Measurables from './measurables';
import { Sorts, defaultSort } from './types/domain';
import type {
  PositionId,
  PositionKey,
  PlayerPositions,
  MeasurableKey,
  PlayerStore,
  MeasurementStore,
  StatisticsStore,
  PositionEligibilityStore,
} from './types/domain';

const playerStore: PlayerStore = new Map();
const measurementStore: MeasurementStore = new Map();
const statisticsStore: StatisticsStore = new Map();
const positionEligibilityStore: PositionEligibilityStore = new Map();

const stores = {
  playerStore,
  measurementStore,
  statisticsStore,
  positionEligibilityStore,
};

const getPlayers = async () =>
  db.many(
    `select
        canonical_name as id,
        CONCAT(p.first_name, ' ', p.last_name) as name,
        draft_year as draft,
        id as key
      from t_player p`,
  );

const getPositionsForPlayer = async key =>
  (await db.many(
    `select
        position_id as position_key
      from t_position_eligibility
      where player_id = $(key)`,
    { key },
  )).map(result => result.position_key);

const getBestMeasurementsForPlayer = async key => Object.values((await db.many(
    `select 
        measurable_id as measurable,
        measurement,
        source
      from t_measurement
      where player_id=$(key)`,
    { key },
  )).reduce((accum, value) => {
    const meas = value.measurable;
    if (!accum[meas]
      || (accum[meas].measurement > value.measurement
        && defaultSort(Measurables[meas].unit) === Sorts.ASC)
      || (accum[meas].measurement < value.measurement
        && defaultSort(Measurables[meas].unit) === Sorts.DESC)) {
      const retval = Object.assign({}, accum);
      retval[meas] = value;
      return retval;
    }
    return accum;
  }, {})).map((measurement: any) => {
    const retval = Object.assign({}, measurement, { measurableKey: measurement.measurable });
    delete retval.measurable;
    return retval;
  });

const impliedPositions = (explicitPositionIds: Array<PositionKey>): PlayerPositions => {
  const impliedSet = ['ATH'];
  explicitPositionIds.forEach((positionKey) => {
    let stringPosId = positionKey.toString(10);
    for (let offset = 0; offset < stringPosId.length; offset += 1) {
      stringPosId = stringPosId.substr(0, stringPosId.length - offset);
      const pos = getByKey(parseInt(stringPosId, 10));
      if (pos && impliedSet.indexOf(pos.id) === -1) {
        impliedSet.push(pos.id);
      }
    }
  });
  if (impliedSet.indexOf('DE') !== -1 || impliedSet.indexOf('34B') !== -1) {
    impliedSet.push('EDGE');
  }
  return {
    primary: getDefaultPosition(impliedSet.map(pid => getById(pid))).id,
    all: impliedSet,
  };
};

export default async () => {
  await Promise.all((await getPlayers()).map(async (player) => {
    playerStore.set(player.id, Object.assign({}, player, {
      positions: impliedPositions(await getPositionsForPlayer(player.key)),
      measurements: await getBestMeasurementsForPlayer(player.key),
    }));
  }));

  const positionCounters: Map<PositionId, number> = new Map();
  const measurementCounters: Map<PositionId, Map<MeasurableKey, number>> = new Map();
  const measurementSums: Map<PositionId, Map<MeasurableKey, number>> = new Map();
  const measurementMeans: Map<PositionId, Map<MeasurableKey, number>> = new Map();
  const measurementDeviationSums: Map<PositionId, Map<MeasurableKey, number>> = new Map();
  const measurementIndicies: Map<PositionId, Map<MeasurableKey, number>> = new Map();

  playerStore.forEach((player) => {
    player.positions.all.forEach((positionId) => {
      positionCounters.set(positionId, (positionCounters.get(positionId) || 0) + 1);
      player.measurements.forEach(({ measurableKey, measurement }) => {
        if (!measurementDeviationSums.has(positionId)) {
          measurementDeviationSums.set(positionId, new Map());
        }
        if (!measurementIndicies.has(positionId)) {
          measurementIndicies.set(positionId, new Map());
        }
        const posCounters = measurementCounters.get(positionId) || new Map();
        posCounters.set(measurableKey, (posCounters.get(measurableKey) || 0) + 1);
        measurementCounters.set(positionId, posCounters);
        const posSums = measurementSums.get(positionId) || new Map();
        posSums.set(measurableKey, (posSums.get(measurableKey) || 0) + measurement);
        measurementSums.set(positionId, posSums);
      });
    });
  });

  measurementCounters.forEach((map: Map<MeasurableKey, number>, positionId: PositionId) => {
    map.forEach((count: number, measurableKey: MeasurableKey) => {
      const measurableMap = measurementStore.get(positionId) || new Map();
      measurementStore.set(positionId, measurableMap);
      measurableMap.set(measurableKey, new Float32Array(count));
      const meansMap = measurementMeans.get(positionId) || new Map();
      meansMap.set(
        measurableKey,
        // $FlowFixMe
        measurementSums.get(positionId).get(measurableKey) /
          // $FlowFixMe
          (measurementCounters.get(positionId).get(measurableKey) || 1),
      );
      measurementMeans.set(positionId, meansMap);
    });
  });

  playerStore.forEach((player) => {
    player.positions.all.forEach((positionId) => {
      const positionList = positionEligibilityStore.get(positionId) || [];
      positionList.push(player.id);
      positionEligibilityStore.set(positionId, positionList);
      player.measurements.forEach(({ measurableKey, measurement }) => {
        // $FlowFixMe
        const deviation = (measurement - measurementMeans.get(positionId).get(measurableKey)) ** 2;
        // $FlowFixMe
        measurementDeviationSums.get(positionId).set(
          measurableKey,
          // $FlowFixMe
          (measurementDeviationSums.get(positionId).get(measurableKey) || 0) + deviation,
        );
        // $FlowFixMe
        const measurementIndex = measurementIndicies.get(positionId).get(measurableKey) || 0;
        // $FlowFixMe
        measurementIndicies.get(positionId).set(measurableKey, measurementIndex + 1);
        // $FlowFixMe
        measurementStore.get(positionId).get(measurableKey)[measurementIndex] = measurement;
      });
    });
  });

  measurementStore.forEach(map => map.forEach(measurements => measurements.sort((a, b) => a - b)));

  measurementDeviationSums.forEach((map, positionId) => {
    const positionStatisticsStore = statisticsStore.get(positionId) || new Map();
    map.forEach((deviationSum, measurableKey) => {
      // $FlowFixMe
      const count = measurementCounters.get(positionId).get(measurableKey) || 1;
      positionStatisticsStore.set(measurableKey, {
        count,
        // $FlowFixMe
        mean: measurementMeans.get(positionId).get(measurableKey) || 0,
        stddev: Math.sqrt(deviationSum / count),
      });
    });
    statisticsStore.set(positionId, positionStatisticsStore);
  });

  return stores;
};

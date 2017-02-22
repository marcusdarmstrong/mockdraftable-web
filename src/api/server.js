// @flow

import type { Api } from '../types/api';
import type { Player, PlayerId, PositionId, Stores, MeasurableId, Sort } from '../types/domain';
import type { SearchOptions } from '../types/state';

import { throw500 } from '../http';
import getComparablePlayersAtPosition from '../services/comparisons/get-comparable-players-at-position';
import getPercentileAtPosition from '../services/statistics/get-percentile-at-position';
import measurables from '../measurables';
import { Sorts } from '../types/domain';

const pageSize = 20;

const byName = (sort: Sort) => {
  if (sort === Sorts.ASC) {
    return (a: Player, b: Player) => (a.name > b.name) ? 1 : -1;
  }
  return (a: Player, b: Player) => (a.name < b.name) ? 1 : -1;
};

const byMeasurable = (measurableId: MeasurableId, sort: Sort) => {
  const measurableKey = (
    measurables[measurableId] || throw500(`Unknown measurable id: ${measurableId}`)
  ).key;
  const nameSort = byName(sort);
  return (a: Player, b: Player) => {
    const aMeas = a.measurements.find(measurement => measurement.measurableKey === measurableKey);
    const bMeas = b.measurements.find(measurement => measurement.measurableKey === measurableKey);
    if (aMeas) {
      if (bMeas) {
        return sort === Sorts.ASC
          ? aMeas.measurement - bMeas.measurement
          : bMeas.measurement - aMeas.measurement;
      }
      return -1;
    } else if (bMeas) {
      return 1;
    }
    return nameSort(a, b);
  };
};

const api: (Stores) => Api =
  ({ playerStore, statisticsStore, positionEligibilityStore, measurementStore }) => {
    const compLookup = getComparablePlayersAtPosition(
      playerStore,
      statisticsStore,
      positionEligibilityStore,
    );
    const percLookup = getPercentileAtPosition(measurementStore);

    return {
      fetchPlayer: async (id: PlayerId) =>
        playerStore.get(id) || throw500(`Internally requested invalid player: ${id}`),
      fetchComparisons: async (id: PlayerId, pos: PositionId) =>
        compLookup(id, pos, 10),
      fetchPercentiles: async (id: PlayerId, pos: PositionId) => {
        const player = playerStore.get(id) || throw500(`Internally requested invalid player: ${id}`);
        return player.measurements.map(({ measurableKey, measurement }) => ({
          measurableKey,
          percentile: percLookup(pos, measurableKey, measurement),
        }));
      },
      fetchSearchResults: async (opts: SearchOptions, pos: PositionId) => {
        const beginIndex = pageSize * (opts.page - 1);
        const playerIds = positionEligibilityStore.get(pos)
          || throw500(`No players found for position: ${pos}`);
        const players = playerIds.map(id => (playerStore.get(id) || throw500(`Unknown player id: ${id}`)))
          .filter(p => p.draft <= opts.endYear && p.draft >= opts.beginYear)
          .sort(
            opts.measurableId
              ? byMeasurable(opts.measurableId, opts.sortOrder)
              : byName(opts.sortOrder),
          );

        return {
          hasNextPage: players.length > (beginIndex + pageSize),
          players: players.slice(beginIndex, beginIndex + pageSize).map(p => p.id),
        };
      },
    };
  };

export default api;

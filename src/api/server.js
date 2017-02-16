// @flow

import type { Api } from '../types/api';
import type { PlayerId, PositionId, Stores } from '../types/domain';
import type { SearchOptions } from '../types/state';

import { throw500 } from '../http';
import getComparablePlayersAtPosition from '../services/comparisons/get-comparable-players-at-position';
import getPercentileAtPosition from '../services/statistics/get-percentile-at-position';

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
        if (opts) {
          return ['marcus-mariota'];
        } else if (pos) {
          return ['aaron-glenn'];
        }
        return ['jay-ajayi'];
      },
    };
  };

export default api;

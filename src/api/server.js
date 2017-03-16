// @flow

import type { Api } from '../types/api';
import type { Player, PlayerId, PositionId, Stores, MeasurableId, Sort } from '../types/domain';
import type { SearchOptions } from '../types/state';

import { throw500 } from '../http';
import getComparablePlayersAtPosition from '../services/comparisons/get-comparable-players-at-position';
import getPercentileAtPosition from '../services/statistics/get-percentile-at-position';
import getUserByEmail from '../services/users/get-user-by-email';
import createUser from '../services/users/create-user';
import measurables from '../measurables';
import { Sorts } from '../types/domain';
import { checkPassword } from '../pass-hash';

const pageSize = 20;
const typeAheadPageSize = 5;

const byName = (sort: Sort) => {
  if (sort === Sorts.DESC) {
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
      fetchTypeAheadResults: async (search: string) => {
        const searchTerm = search.toUpperCase().replace(/\W/g, '');
        const results = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const player of playerStore.values()) {
          if (player.name.toUpperCase().replace(/\W/g, '').includes(searchTerm)) {
            results.push(player.id);
            if (results.length >= typeAheadPageSize) {
              break;
            }
          }
        }
        return results;
      },
      fetchDistributionStats: async (pos: PositionId) => {
        const rawData = statisticsStore.get(pos) || throw500('Invalid Position ID');
        const result = {};
        rawData.forEach((val, key) => {
          result[key] = val;
        });
        return result;
      },
      loginUser: async (email: string, password: string) => {
        try {
          const dbuser = await getUserByEmail(email);
          if (dbuser && checkPassword(dbuser.email, password, dbuser.pass_hash)) {
            return { userId: dbuser.id };
          }
          return { error: 'Mismatched email and password' };
        } catch (e) {
          return { error: 'Mismatched email and password' };
        }
      },
      createUser: async (email: string, password: string) => {
        try {
          const dbuser = await createUser(email, password);
          if (dbuser) {
            return { userId: dbuser.id };
          }
          return { error: 'Unable to create user' };
        } catch (e) {
          console.log(e.message);
          return { error: 'Unable to create user' };
        }
      },
      doesUserExist: async (email: string) => {
        try {
          const dbuser = await getUserByEmail(email);
          if (dbuser) {
            return { userId: dbuser.id };
          }
          return { error: 'Email addresss already taken' };
        } catch (e) {
          return { error: 'Email addresss already taken' };
        }
      },
      logout: async () => true,
    };
  };

export default api;

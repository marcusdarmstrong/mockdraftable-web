// @flow

import type { Api, AddPlayerDetails } from '../types/api';
import type { Player, PlayerId, PositionId, Stores, MeasurableId, Sort, SchoolKey } from '../types/domain';
import type { UserId, SearchOptions } from '../types/state';

import { throw500 } from '../packages/http';
import getComparablePlayersAtPosition from '../services/comparisons/get-comparable-players-at-position';
import getPercentileAtPosition from '../services/statistics/get-percentile-at-position';
import getUserByEmail from '../services/users/get-user-by-email';
import createUser from '../services/users/create-user';
import measurables from '../measurables';
import { Sorts, PlayerStatuses } from '../types/domain';
import { checkPassword } from '../packages/pass-hash';
import getAllSchools from '../services/schools/get-all-schools';
import createPlayer from '../services/players/create-player';
import createSchool from '../services/schools/create-school';
import getUserById from '../services/users/get-user-by-id';
import getSchoolByKey from '../services/schools/get-school-by-key';

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

    const lookupPlayerOrDie =
      (id: PlayerId) => playerStore.get(id) || throw500(`Requested invalid player: ${id}`);

    const getPercentiles = (id: PlayerId, pos: PositionId) =>
      lookupPlayerOrDie(id).measurements.map(({ measurableKey, measurement }) => ({
        measurableKey,
        percentile: percLookup(pos, measurableKey, measurement),
      }));

    return {
      fetchPlayer: async (id: PlayerId) => lookupPlayerOrDie(id),
      fetchComparisons: async (id: PlayerId, pos: PositionId) => compLookup(id, pos, 10),
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
            return { success: true, userId: dbuser.id };
          }
          return { success: false, error: 'Mismatched email and password' };
        } catch (e) {
          return { success: false, error: 'Mismatched email and password' };
        }
      },
      createUser: async (email: string, password: string) => {
        try {
          const dbuser = await createUser(email, password);
          if (dbuser) {
            return { success: true, userId: dbuser.id };
          }
          return { success: false, error: 'Unable to create user' };
        } catch (e) {
          console.log(e.message);
          return { success: false, error: 'Unable to create user' };
        }
      },
      doesUserExist: async (email: string) => {
        try {
          const dbuser = await getUserByEmail(email);
          if (dbuser) {
            return { success: true, userId: dbuser.id };
          }
          return { success: false, error: 'Email addresss already taken' };
        } catch (e) {
          return { success: false, error: 'Email addresss already taken' };
        }
      },
      logout: async () => true,
      fetchMultiplePlayers: async (ids: Array<PlayerId>) => ids.map(lookupPlayerOrDie),
      fetchMultiplePercentiles: async (ids: Array<PlayerId>, pos: PositionId) =>
        ids.reduce((accum, id) => Object.assign({}, accum, { [id]: getPercentiles(id, pos) }), {}),
      addPlayer: async (details: AddPlayerDetails) => {
        if (details.firstName !== '' && details.lastName !== '') {
          // Add the player somehow.
          console.log(JSON.stringify(details));
          let schoolKey: ?SchoolKey = Number(details.schoolKey);
          if (schoolKey === 0) {
            schoolKey = null;
          } else if (schoolKey === -1 && details.newSchoolName) {
            schoolKey = await createSchool(details.newSchoolName);
          }
          const newPlayer =
            await createPlayer(details.firstName, details.lastName, details.draftYear, schoolKey);

          if (newPlayer) {
            playerStore.set(newPlayer.id, Object.assign({}, {
              id: newPlayer.id,
              key: newPlayer.key,
              name: `${details.firstName} ${details.lastName}`,
              draft: details.draftYear,
              measurements: [],
              positions: { primary: 'ATH', all: ['ATH'] },
              status: PlayerStatuses.PENDING,
            }, !schoolKey ? {} : { school: await getSchoolByKey(schoolKey) }));

            if (schoolKey && details.newSchoolName) {
              return {
                success: true,
                playerId: newPlayer.id,
                schoolKey,
              };
            }
            return { success: true, playerId: newPlayer.id };
          }
        }
        return { success: false, error: 'Could not add player' };
      },
      getSchools: async () => getAllSchools(),
      getUserPermissions: async (id: UserId) => {
        const user = await getUserById(id);
        return {
          isAdmin: !!user && user.status === 3,
          isContributor: !!user && user.status >= 2,
        };
      },
    };
  };

export default api;

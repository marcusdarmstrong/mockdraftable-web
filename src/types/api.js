// @flow

import type { Player, PlayerId, Comparisons, Percentiles, PositionId, MeasurableKey, DistributionStatistics } from './domain';
import type { UserId, SearchOptions, SearchResults, ValidationError } from './state';

export type LoginResponse =
  { success: true, userId: UserId } | { success: false, error: ValidationError };

export interface Api {
  fetchPlayer: (id: PlayerId) => Promise<Player>,
  fetchComparisons: (id: PlayerId, pos: PositionId) => Promise<Comparisons>,
  fetchSearchResults: (opts: SearchOptions, pos: PositionId) => Promise<SearchResults>,
  fetchTypeAheadResults: (search: string) => Promise<Array<PlayerId>>,
  fetchDistributionStats: (pos: PositionId) => Promise<{ [MeasurableKey]: DistributionStatistics}>,
  fetchMultiplePlayers: (ids: Array<PlayerId>) => Promise<Array<Player>>,
  fetchMultiplePercentiles: (ids: Array<PlayerId>, pos: PositionId) =>
    Promise<{ [PlayerId]: Percentiles }>,
  loginUser: (email: string, password: string) => Promise<LoginResponse>,
  createUser: (email: string, password: string) => Promise<LoginResponse>,
  doesUserExist: (email: string) => Promise<LoginResponse>,
  logout: () => Promise<boolean>,
}

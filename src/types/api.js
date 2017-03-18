// @flow

import type { Player, PlayerId, Comparisons, Percentiles, PositionId, MeasurableKey, DistributionStatistics } from './domain';
import type { UserId, SearchOptions, SearchResults, ValidationError } from './state';

export type LoginResponse =
  { success: true, userId: UserId } | { success: false, error: ValidationError };

export interface Api {
  fetchPlayer: (id: PlayerId) => Promise<Player>,
  fetchComparisons: (id: PlayerId, pos: PositionId) => Promise<Comparisons>,
  fetchPercentiles: (id: PlayerId, pos: PositionId) => Promise<Percentiles>,
  fetchSearchResults: (opts: SearchOptions, pos: PositionId) => Promise<SearchResults>,
  fetchTypeAheadResults: (search: string) => Promise<Array<PlayerId>>,
  fetchDistributionStats: (pos: PositionId) => Promise<{ [MeasurableKey]: DistributionStatistics}>,
  loginUser: (email: string, password: string) => Promise<LoginResponse>,
  createUser: (email: string, password: string) => Promise<LoginResponse>,
  doesUserExist: (email: string) => Promise<LoginResponse>,
  logout: () => Promise<boolean>,
}

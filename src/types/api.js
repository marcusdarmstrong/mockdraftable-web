// @flow

import type { Player, PlayerId, Comparisons, Percentiles, PositionId, MeasurableKey, DistributionStatistics } from './domain';
import type { SearchOptions, SearchResults } from './state';

export interface Api {
  fetchPlayer: (id: PlayerId) => Promise<Player>,
  fetchComparisons: (id: PlayerId, pos: PositionId) => Promise<Comparisons>,
  fetchPercentiles: (id: PlayerId, pos: PositionId) => Promise<Percentiles>,
  fetchSearchResults: (opts: SearchOptions, pos: PositionId) => Promise<SearchResults>,
  fetchTypeAheadResults: (search: string) => Promise<Array<PlayerId>>,
  fetchDistributionStats: (pos: PositionId) => Promise<{ [MeasurableKey]: DistributionStatistics}>,
}

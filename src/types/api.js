// @flow

import type { Player, PlayerId, Comparisons, Percentiles, PositionId } from './domain';
import type { SearchOptions, SearchResults } from './state';

export interface Api {
  fetchPlayer: (id: PlayerId) => Promise<Player>,
  fetchComparisons: (id: PlayerId, pos: PositionId) => Promise<Comparisons>,
  fetchPercentiles: (id: PlayerId, pos: PositionId) => Promise<Percentiles>,
  fetchSearchResults: (opts: SearchOptions, pos: PositionId) => Promise<SearchResults>,
}

// @flow

import type { PlayerId, PositionId, MeasurableId, Player, Position, Measurable, MeasurableKey, Percentiles, Comparisons, Sort } from './domain';

type TypeAheadState = {
  typeAheadResults?: Array<PlayerId>,
};

export type ModalType = 'PositionSelector' | 'TypeAhead' | 'None';

export type SearchOptions = {
  beginYear: number,
  endYear: number,
  measurableId?: MeasurableId,
  sortOrder: Sort,
  page: number,
};

type GlobalAppState = {
  selectedPositionId: PositionId,
};

export type SearchResults = {
  players: Array<PlayerId>,
  hasNextPage: boolean,
};

type SearchPageState = {
  searchOptions?: SearchOptions,
  searchResults?: SearchResults,
  isSearching?: boolean,
};

type PlayerPageState = {
  selectedPlayerId?: PlayerId,
};

type UiState = {
  modalType: ModalType,
} & TypeAheadState;

type AppState = SearchPageState & PlayerPageState & GlobalAppState;

type Domain = {
  players: { [key: PlayerId]: Player },
  positions: { [key: PositionId]: Position },
  measurables: { [key: MeasurableKey]: Measurable },
  comparisons: { [key: PlayerId]: { [key: PositionId]: Comparisons } },
  percentiles: { [key: PlayerId]: { [key: PositionId]: Percentiles } },
};

export type State = Domain & AppState & UiState;

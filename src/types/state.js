// @flow

import type { Id, PlayerId, PositionId, MeasurableId, Player, Position, Measurable, MeasurableKey, Percentiles, Comparisons, Sort, DistributionStatistics } from './domain';

export type UserId = Id;
export type ValidationError = string;

type TypeAheadState = {
  typeAheadSearching?: boolean,
  typeAheadResults?: Array<PlayerId>,
};

export type ModalType = 'PositionSelector' | 'TypeAhead' | 'Embed' | 'None' | 'Login';

export type SearchOptions = {
  beginYear: number,
  endYear: number,
  measurableId?: MeasurableId,
  sortOrder: Sort,
  page: number,
};

type GlobalAppState = {
  selectedPositionId: PositionId,
  loggedInUserId: ?UserId,
};

export type SearchResults = {
  players: Array<PlayerId>,
  hasNextPage: boolean,
};

export type EmbedPage = 'GRAPH' | 'COMPARISONS' | 'MEASURABLES';

type EmbedState = {
  embed: boolean,
  embedPage?: EmbedPage,
};

type UiState = {
  modalType: ModalType,
} & TypeAheadState;

type AppState =
  & GlobalAppState
  & EmbedState;

type Domain = {
  players: { [PlayerId]: Player },
  positions: { [PositionId]: Position },
  measurables: { [MeasurableKey]: Measurable },
  comparisons: { [PlayerId]: { [PositionId]: Comparisons } },
  percentiles: { [PlayerId]: { [PositionId]: Percentiles } },
  distributionStatistics: { [PositionId]: { [MeasurableKey]: DistributionStatistics } };
};

export type SharedState = Domain & AppState & UiState;

export type PlayerPageState = SharedState & {
  page: 'PLAYER',
  selectedPlayerId: PlayerId,
};
export type SearchPageState = SharedState & {
  page: 'SEARCH',
  searchOptions: SearchOptions,
  searchResults: SearchResults,
  isSearching: boolean,
};

export type PositionPageState = SharedState & {
  page: 'POSITION',
};

export type HomePageState = SharedState & {
  page: 'HOME';
};

export type State = HomePageState | PositionPageState | SearchPageState | PlayerPageState;

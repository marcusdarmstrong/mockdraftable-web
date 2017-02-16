// @flow

import { Map } from 'immutable';
import type { PlayerId, PositionId, MeasurableId, Player, Position, Measurable, MeasurableKey, Percentiles, Comparisons, Sort } from './domain';

type TypeAheadState = {
  component: 'TypeAhead',
  results: Array<PlayerId>,
};

export type SearchOptions = {
  beginYear: number,
  endYear: number,
  measurableId?: MeasurableId,
  sortOrder: Sort,
  page: number,
};

type ModalState = TypeAheadState;

type GlobalAppState = {
  selectedPositionId: PositionId,
};


type SearchPageState = {
  searchOptions?: SearchOptions,
  searchResults?: Array<PlayerId>,
};

type PlayerPageState = {
  selectedPlayerId?: PlayerId,
};

type UiState = {
  modal?: ModalState,
};

type AppState = PlayerPageState & SearchPageState & GlobalAppState;

type Domain = {
  players: Map<PlayerId, Player>,
  positions: Map<PositionId, Position>,
  measurables: Map<MeasurableKey, Measurable>,
  comparisons: Map<PlayerId, Map<PositionId, Comparisons>>,
  percentiles: Map<PlayerId, Map<PositionId, Percentiles>>,
};

export type State = Domain & AppState & UiState;

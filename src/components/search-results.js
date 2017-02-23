// @flow

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import SearchResult from './search-result';
import { Sorts } from '../types/domain';
import type { Action } from '../actions';
import type { Player, Position, MeasurableId } from '../types/domain';
import type { MeasurablePercentile } from '../types/graphing';
import measurables, { format } from '../measurables';
import SearchControls from './search-controls';
import type { SearchOptions } from '../types/state';
import { selectNewSearch } from '../actions';
import SearchPaging from './search-paging';

type DisplayableSearchResult = {
  player: Player,
  playerPosition: Position,
  percentiles: Array<MeasurablePercentile>,
  measurable?: string
};

type Props = {
  isSearching: boolean,
  searchOptions: SearchOptions;
  selectedPosition: Position,
  players: Array<DisplayableSearchResult>,
  selectMeasurable: (SearchOptions) => (?MeasurableId) => void,
  toggleSortOrder: (SearchOptions) => () => void,
  selectPage: (SearchOptions) => (number) => void,
  hasNextPage: boolean,
};

const SearchResults = ({
  isSearching,
  searchOptions,
  selectedPosition,
  players,
  selectMeasurable,
  toggleSortOrder,
  hasNextPage,
  selectPage,
}: Props) =>
  <div>
    <h3>Search Results</h3>
    <SearchControls
      selectedSortOrder={searchOptions.sortOrder}
      selectedMeasurable={searchOptions.measurableId}
      selectMeasurable={selectMeasurable(searchOptions)}
      toggleSortOrder={toggleSortOrder(searchOptions)}
    />
    {isSearching
      ? <div className="loader">Loading...</div>
      : <div className="list-group mb-2">
        {players.length === 0
          ? <div className="alert alert-warning">
            <strong>Whoops!</strong> No players met your criteria.
          </div>
          : players.map((result: DisplayableSearchResult) =>
            result.measurable ?
              <SearchResult
                key={result.player.key}
                name={result.player.name}
                playerPosition={result.playerPosition}
                selectedPosition={selectedPosition}
                id={result.player.id}
                percentiles={result.percentiles}
                measurable={result.measurable}
              />
              :
              <SearchResult
                key={result.player.key}
                name={result.player.name}
                playerPosition={result.playerPosition}
                selectedPosition={selectedPosition}
                id={result.player.id}
                percentiles={result.percentiles}
              />,
        )}
      </div>
    }
    {players.length !== 0 && (<SearchPaging
      currentPage={searchOptions.page}
      hasNextPage={hasNextPage}
      selectPage={selectPage(searchOptions)}
    />)}
  </div>;

export default connect(
  state => ({
    isSearching: state.isSearching,
    searchOptions: state.searchOptions,
    selectedPosition: state.positions[state.selectedPositionId],
    players:
      state.searchResults.players
        .map((playerId) => {
          const baseResult = {
            player: state.players[playerId],
            playerPosition: state.positions[state.players[playerId].positions.primary],
            percentiles: state.percentiles[playerId][state.selectedPositionId]
              .map(({ measurableKey, percentile }) => ({
                percentile,
                measurable: {
                  id: measurableKey,
                  name: state.measurables[measurableKey].name,
                },
              })),
            measurable: undefined,
          };
          if (state.searchOptions.measurableId) {
            const measurable = measurables[state.searchOptions.measurableId];
            const value = baseResult.player.measurements
              .find(measurement => measurement.measurableKey === measurable.key);
            baseResult.measurable = value ? format(value.measurement, measurable) : '?';
          }
          return baseResult;
        }),
    hasNextPage: state.searchResults.hasNextPage,
  }),
  (dispatch: Dispatch<Action>) => ({
    selectMeasurable: searchOptions => (measurableId) => {
      dispatch(selectNewSearch(Object.assign({}, searchOptions, { measurableId })));
    },
    toggleSortOrder: searchOptions => () => {
      dispatch(selectNewSearch(Object.assign(
        {},
        searchOptions,
        { sortOrder: searchOptions.sortOrder === Sorts.ASC ? Sorts.DESC : Sorts.ASC },
      )));
    },
    selectPage: searchOptions => (page) => {
      dispatch(selectNewSearch(Object.assign({}, searchOptions, { page })));
    },
  }),
)(SearchResults);

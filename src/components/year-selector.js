// @flow

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import MultiSlider from 'multi-slider';

import type { Action } from '../actions';
import type { SearchPageState, SearchOptions } from '../types/state';
import { selectNewSearch } from '../actions';

type Props = {
  min: number,
  max: number,
  low: number,
  high: number,
  onLowChange: SearchOptions => number => void,
  onHighChange: SearchOptions => number => void,
  searchOptions: SearchOptions,
};

const YearSelector = ({ min, max, low, high, onLowChange, onHighChange, searchOptions }: Props) => {
  const handler = (newvals: [number, number, number]) => {
    const old0 = low - min;
    if (old0 !== newvals[0]) {
      onLowChange(searchOptions)(min + newvals[0]);
    }
    const old2 = max - high;
    if (old2 !== newvals[2]) {
      onHighChange(searchOptions)(max - newvals[2]);
    }
  };

  return (<div className="row no-gutters align-items-center justify-content-between">
    <div className="ml-1 h6">{low}</div>
    <div className="col-8">
      <MultiSlider defaultValues={[low - min, high - low, max - high]} onChange={handler} />
    </div>
    <div className="mr-1 h6">{high}</div>
  </div>);
};

export default connect((state: SearchPageState) => ({
  low: state.searchOptions && state.searchOptions.beginYear,
  high: state.searchOptions && state.searchOptions.endYear,
  searchOptions: state.searchOptions,
}), (dispatch: Dispatch<Action>) => ({
  onLowChange: searchOptions => (newLow) => {
    dispatch(selectNewSearch(Object.assign({}, searchOptions, { beginYear: newLow, page: 1 })));
  },
  onHighChange: searchOptions => (newHigh) => {
    dispatch(selectNewSearch(Object.assign({}, searchOptions, { endYear: newHigh, page: 1 })));
  },
}))(YearSelector);

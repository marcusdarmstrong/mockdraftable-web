// @flow

import React from 'react';

import YearSelector from './year-selector';
import PositionSelector from './position-selector';
import SearchResults from './search-results';

export default () => (
  <div className="window container-fluid col-12 col-lg-10 offset-lg-1">
    <div className="row">
      <div className="col-12 col-md-5">
        <h4>Draft Class</h4>
        <YearSelector
          min={1999}
          max={2018}
        />
        <h4>Position</h4>
        <PositionSelector />
      </div>
      <div className="col-12 col-md-7">
        <SearchResults />
      </div>
    </div>
  </div>
);

// @flow

import React from 'react';

import YearSelector from './year-selector';
import SearchResults from './search-results';

export default () => <div className="container-fluid window">
  <div className="container-fluid col-12 col-xl-10 offset-xl-1">
    <div className="row">
      <div className="col-12 col-md-5">
        <YearSelector
          min={1999}
          max={2017}
          low={1999}
          high={2017}
          onLowChange={() => false}
          onHighChange={() => false}
        />
      </div>
      <div className="col-12 col-md-7">
        <SearchResults />
      </div>
    </div>
  </div>
</div>;

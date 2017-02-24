// @flow

import React from 'react';

import TypeAhead from './typeahead';

export default () => <div className="window container-fluid col-12 col-lg-10 offset-lg-1">
  <div className="row">
    <div className="col-12 col-lg-6 offset-lg-3">
      <p className="lead text-center">
        MockDraftable is the most comprehensive tool on the internet for NFL combine-based player
        &nbsp;analysis and data visualization. Take a look around. You&apos;ll be surprised what
        &nbsp;you discover.
      </p>
      <p>
        <a href="/search" className="btn btn-lg btn-success btn-block">Search the Database</a>
      </p>
      <hr className="my-4" />
      <TypeAhead />
    </div>
  </div>
</div>;

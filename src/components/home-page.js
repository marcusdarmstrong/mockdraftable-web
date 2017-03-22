// @flow

import React from 'react';

import TypeAhead from './typeahead';
import Link from './link';

export default () => <div className="window container-fluid col-12 col-lg-10 offset-lg-1">
  <div className="row">
    <div className="col-12 col-lg-6 offset-lg-3">
      <p className="lead text-center">
        MockDraftable is the most comprehensive tool on the internet for NFL combine-based player
        analysis and data visualization. Take a look around. You&apos;ll be surprised what
        you discover.
      </p>
      <p>
        <Link href="/search" className="btn btn-lg btn-primary btn-block">Explore the Database &raquo;</Link>
      </p>
      <p className="text-center">
        Or take a look at <Link href="/positions">Aggregate Data</Link>.
      </p>
      <hr className="my-4" />
      <TypeAhead />
    </div>
  </div>
</div>;

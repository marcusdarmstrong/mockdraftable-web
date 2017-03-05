// @flow

import React from 'react';

import PositionSelector from './position-selector';
import PositionStatsSection from './position-stats-section';

export default () => <div className="window container-fluid col-12 col-lg-10 offset-lg-1">
  <div className="row">
    <div className="col-12 col-lg-6 offset-lg-3">
      <PositionSelector />
      <PositionStatsSection />
    </div>
  </div>
</div>;

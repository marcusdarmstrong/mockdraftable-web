// @flow

import React from 'react';

import PositionSelector from './position-selector';
import PositionStatsSection from './position-stats-section';

type Props = {
  positionName: string,
};

export default ({ positionName }: Props) => (
  <div className="window container-fluid col-12 col-lg-10 ml-auto mr-auto">
    <div className="row">
      <div className="col-12 col-lg-6 ml-auto mr-auto">
        <PositionSelector />
        <h3>Aggregate Statistics</h3>
        <h6 className="text-muted">{positionName}</h6>
        <PositionStatsSection />
      </div>
    </div>
  </div>
);

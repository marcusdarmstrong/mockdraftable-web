// @flow

import React from 'react';

import PositionStatsSection from './position-stats-section';

type Props = {
  positionName: string,
};

export default ({ positionName }: Props) =>
  <div className="window container-fluid col-12 col-lg-10 offset-lg-1">
    <div className="row">
      <div className="col-12 col-lg-6 offset-lg-3">
        <h3>Aggregate Statistics</h3>
        <h6 className="text-muted">{positionName}</h6>
        <PositionStatsSection />
      </div>
    </div>
  </div>;

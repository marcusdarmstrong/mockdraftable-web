// @flow

import React from 'react';
import { connect } from 'react-redux';

import { round } from 'lodash';
import type { PositionPageState } from '../types/state';
import type { DistributionStatistics, MeasurableKey } from '../types/domain';

type MeasurableStatistics = {
  name: string,
  stats: DistributionStatistics,
};

type Props = {
  positionStats: Array<MeasurableStatistics>,
};

const PositionStatsSection = ({ positionStats }: Props) =>
  <table className="table table-sm">
    <thead>
      <tr>
        <th>Measurable</th>
        <th>Count</th>
        <th>Mean</th>
        <th>StdDev</th>
      </tr>
    </thead>
    <tbody>
      {positionStats.map(s => <tr key={s.name}>
        <td>{s.name}</td>
        <td>{s.stats.count}</td>
        <td>{round(s.stats.mean, 3)}</td>
        <td>{round(s.stats.stddev, 3)}</td>
      </tr>)}
    </tbody>
  </table>;

export default connect((state: PositionPageState) => ({
  positionStats:
    Object.entries(state.distributionStatistics[state.selectedPositionId]).map(entry => ({
      name: state.measurables[((entry[0]: any): MeasurableKey)].name,
      stats: entry[1],
    })),
}))(PositionStatsSection);

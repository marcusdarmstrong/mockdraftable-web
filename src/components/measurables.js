import React from 'react';
import type { MeasurablePercentile } from '../types/graphing';

type DisplayableMeasurement = MeasurablePercentile & { display: string };
type Props = DisplayableMeasurement[];

export default ({ measurements }: Props) =>
  <table className="table">
    <thead>
      <tr>
        <th>Measurable</th>
        <th>Measurement</th>
        <th>%tile</th>
      </tr>
    </thead>
    <tbody>
      {measurements.map(m => <tr key={m.measurable.id}>
        <td>{m.measurable.name}</td>
        <td>{m.display}</td>
        <td>{m.percentile}</td>
      </tr>)}
    </tbody>
  </table>;

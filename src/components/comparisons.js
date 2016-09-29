// @flow

import React from 'react';
import SparkGraph from './graphs/spark-graph';
import type { MeasurablePercentile } from '../types/graphing';

type Props = {
  percentiles: MeasurablePercentile[];
};

export default (props: Props) =>
  <div className="list-group">
    <a href="/p/jamaal-brown" className="list-group-item list-group-item-action">
      <SparkGraph percentiles={props.percentiles} comparison="83.5%" />
      <h5 className="list-group-item-heading">Jamaal Brown</h5>
      <p className="list-group-item-text"><span className="tag tag-primary">OT</span></p>
    </a>
    <a href="/p/john-theus" className="list-group-item list-group-item-action">
      <SparkGraph percentiles={props.percentiles} comparison="82.8%" />
      <h5 className="list-group-item-heading">John Theus</h5>
      <p className="list-group-item-text"><span className="tag tag-primary">OT</span></p>
    </a>
    <a href="/p/gabe-carimi" className="list-group-item list-group-item-action">
      <SparkGraph percentiles={props.percentiles} comparison="82.7%" />
      <h5 className="list-group-item-heading">Gabe Carimi</h5>
      <p className="list-group-item-text"><span className="tag tag-primary">OT</span></p>
    </a>
    <a href="/p/eugene-monroe" className="list-group-item list-group-item-action">
      <SparkGraph percentiles={props.percentiles} comparison="81.9%" />
      <h5 className="list-group-item-heading">Eugene Monroe</h5>
      <p className="list-group-item-text"><span className="tag tag-primary">OT</span></p>
    </a>
    <a href="/p/paul-cornick" className="list-group-item list-group-item-action">
      <SparkGraph percentiles={props.percentiles} comparison="81.5%" />
      <h5 className="list-group-item-heading">Paul Cornick</h5>
      <p className="list-group-item-text"><span className="tag tag-primary">OT</span></p>
    </a>
  </div>;

import React from 'react';

import FullGraph from './graphs/full-graph';
import Measurables from './measurables';
import Nav from './nav';
import Comparisons from './comparisons';

import testData from '../testdata';

const data = testData.measurements;


export default () => <div>
  <Nav title="D'Brickashaw Ferguson" />
  <div className="container-fluid window">
    <div className="container-fluid col-xs-12 col-xl-10 offset-xl-1">
      <div className="row">
        <div className="col-xs-12 col-md-5">
          <h3>About</h3>
          <dl>
            <dt>Position:</dt>
            <dd className="h4">
              <ol className="list-inline">
                <li className="list-inline-item btn btn-primary btn-sm">OT</li>
                <li className="list-inline-item btn btn-outline-success btn-sm">LT</li>
              </ol>
            </dd>
            <dt>Born:</dt>
            <dd>December 10, 1983 (32 years old)</dd>
            <dt>School:</dt>
            <dd>University of Virginia</dd>
            <dt>Draft Information:</dt>
            <dd>
              <table className="table table-sm">
                <tbody>
                  <tr><th scope="row">Year</th><td>2006</td></tr>
                  <tr><th scope="row">Team</th><td>New York Jets</td></tr>
                  <tr><th scope="row">Round</th><td>1</td></tr>
                  <tr><th scope="row">Pick</th><td>6</td></tr>
                  <tr><th scope="row">Overall</th><td>6</td></tr>
                </tbody>
              </table>
            </dd>
          </dl>
        </div>
        <div className="col-xs-12 col-md-7 pull-md-right">
          <h3>Measurables</h3>
          <h6 className="text-muted">Percentiles vs. Offensive Tackles</h6>
          <FullGraph percentiles={data} />
          <Measurables measurements={data} />
        </div>
        <div className="col-xs-12 col-md-5">
          <h3>Comparisons</h3>
          <Comparisons percentiles={data} />
        </div>
      </div>
    </div>
  </div>
</div>;

// @flow

import 'babel-polyfill';
import pullMeasurements from './pull-measurements';

const nflId: number = Number(process.argv[2]);

pullMeasurements(nflId).then(d => console.log(JSON.stringify(d)));

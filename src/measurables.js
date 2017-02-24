// @flow

import { Units } from './types/domain';
import type { Measurable } from './types/domain';

const measurable = (id, key, name, unit): Measurable => ({ id, key, name, unit });

const allMeasurables = [
  measurable('height', 1, 'Height', Units.INCHES),
  measurable('weight', 2, 'Weight', Units.POUNDS),
  measurable('wingspan', 3, 'Wingspan', Units.INCHES),
  measurable('arms', 4, 'Arm Length', Units.INCHES),
  measurable('hands', 5, 'Hand Size', Units.INCHES),
  measurable('10yd', 6, '10 Yard Split', Units.SECONDS),
  measurable('20yd', 7, '20 Yard Split', Units.SECONDS),
  measurable('40yd', 8, '40 Yard Dash', Units.SECONDS),
  measurable('bench', 9, 'Bench Press', Units.REPS),
  measurable('vertical', 10, 'Vertical Jump', Units.INCHES),
  measurable('broad', 11, 'Broad Jump', Units.INCHES),
  measurable('3cone', 12, '3-Cone Drill', Units.SECONDS),
  measurable('20ss', 13, '20 Yard Shuttle', Units.SECONDS),
  measurable('60ss', 14, '60 Yard Shuttle', Units.SECONDS),
];

const measurablesByKey = allMeasurables.reduce(
  (accum, meas) => Object.assign({}, accum, { [meas.key]: meas }),
  {},
);

const getByKey = (key: number) => measurablesByKey[key];

const getFraction = (num) => {
  switch (num) {
    case 0.125:
      return '\u215b';
    case 0.25:
      return '\u00bc';
    case 0.375:
      return '\u215c';
    case 0.5:
      return '\u00bd';
    case 0.625:
      return '\u215d';
    case 0.75:
      return '\u00be';
    case 0.875:
      return '\u215e';
    default:
      if (num !== 0) {
        const numstr = num.toString();
        return numstr.substr(1, numstr.length);
      }
  }
  return '';
};

const format = (measurement: number, measurementType: ?Measurable, nonCombine: ?boolean) => {
  const unit = measurementType ? measurementType.unit : undefined;
  let formatted = measurement.toString();
  if (unit === Units.INCHES) {
    if (measurementType && measurementType.id === 'height') {
      const feet = Math.floor(measurement / 12);
      const inches = Math.floor(measurement % 12);
      const frac = getFraction(measurement % 1);
      formatted = `${feet}' ${inches}${frac}"`;
    } else {
      const inches = Math.floor(measurement);
      const frac = getFraction(measurement % 1);
      formatted = `${inches}${frac}"`;
    }
  } else if (unit === Units.SECONDS) {
    formatted = `${measurement}s`;
  } else if (unit === Units.POUNDS) {
    formatted = `${measurement} lbs`;
  } else if (unit === Units.REPS) {
    formatted = `${measurement} reps`;
  }
  if (nonCombine) {
    formatted = `${formatted}*`;
  }
  return formatted;
};

export { getByKey, allMeasurables, measurablesByKey, format };

const measurablesById = allMeasurables.reduce(
  (a, meas) => Object.assign({}, a, { [meas.id]: meas }),
  {},
);

export default measurablesById;

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

const format = (measurement: number, measurementType: ?Measurable) => {
  const unit = measurementType ? measurementType.unit : undefined;
  if (unit === Units.INCHES) {
    if (measurementType.id === 'height') {
      const feet = Math.floor(measurement / 12);
      const inches = measurement % 12;
      return `${feet}' ${inches}"`;
    }
    return `${measurement}"`;
  } else if (unit === Units.SECONDS) {
    return `${measurement}s`;
  } else if (unit === Units.POUNDS) {
    return `${measurement} lbs`;
  } else if (unit === Units.REPS) {
    return `${measurement} reps`;
  }
  return measurement;
};

export { getByKey, allMeasurables, measurablesByKey, format };

const measurablesById = allMeasurables.reduce(
  (a, meas) => Object.assign({}, a, { [meas.id]: meas }),
  {},
);

export default measurablesById;

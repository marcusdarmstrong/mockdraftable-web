// @flow

import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import db from '../connection';
import { measurablesByKey } from '../measurables';
import createPlayer from '../services/players/create-player';

if (process.argv.length < 4) {
  console.log('Usage: node import-nflds-player.js year id [--commit]');
  process.exit(1);
}

const combineYear: number = Number(process.argv[2]);
const nfldsId: number = Number(process.argv[3]);
const isDryRun: boolean = process.argv[4] !== '--commit';

if (!combineYear || combineYear > 2100 || combineYear < 2000) {
  console.log(`Invalid combine year: ${combineYear}. Please provide a valid year number.`);
  process.exit(1);
}

const positionIdMapping = {
  QB: 21,
  RB: 2212,
  FB: 2211,
  WR: 223,
  TE: 224,
  OG: 321,
  OL: 3,
  C: 322,
  OT: 31,
  G: 321,
  T: 31,
  DT: 411,
  DL: 4,
  DE: 42,
  NT: 4111,
  LB: 6,
  OLB: 622,
  ILB: 621,
  MLB: 621,
  CB: 72,
  DB: 7,
  S: 71,
  FS: 712,
  SS: 711,
  SAF: 71,
  K: 801,
  P: 802,
  KR: 810,
  LS: 803,
};

const measurableIdMapping = {
  Height: 1,
  Weight: 2,
  '40 Yrd Dash': 8,
  '20 Yrd Dash': 7,
  '10 Yrd Dash': 6,
  '225 Lb. Bench Reps': 9,
  'Vertical Jump': 10,
  'Broad Jump': 11,
  '20 Yrd Shuttle': 13,
  '3-Cone Drill': 12,
};

const parseMeasurement = (measurableId, rawMeasurement) => {
  if (measurableId === 1) {
    const meas = Number(rawMeasurement);
    const feet = Math.floor(meas / 1000);
    const eigths = meas % 10;
    const inches = Math.floor(((meas - (feet * 1000)) - eigths) / 10);
    return (inches + (feet * 12)) + (eigths / 8);
  }
  if (measurableId === 10) {
    if (rawMeasurement.indexOf(' ') === -1) {
      return Number(rawMeasurement);
    }
    const parts = rawMeasurement.split(' ');
    return Number(parts[0]) + 0.5;
  }
  if (measurableId === 11) {
    const meas = rawMeasurement.replace(/"/, '');
    const parts = meas.split('\'');
    return (Number(parts[0]) * 12) + Number(parts[1]);
  }
  return Number(rawMeasurement);
};

type Measurement = {
  measurableId: number,
  measurement: number,
  source: number,
};

const parseMeasurables = (originalMeasurablesSection, source): Array<Measurement> => {
  let measurablesSection = originalMeasurablesSection.replace(/<[^>]*>/g, '');
  measurablesSection = measurablesSection.replace(/&nbsp;/g, '');
  measurablesSection = measurablesSection.replace(/\t/g, '');
  measurablesSection = measurablesSection.replace(/ +/g, ' ');
  measurablesSection = measurablesSection.replace(/\r/g, '\n');
  measurablesSection = measurablesSection.replace(/\n /g, '\n');
  measurablesSection = measurablesSection.replace(/\n+/g, '\n');

  const rawMeasurables = measurablesSection.split('\n');
  return (rawMeasurables.filter(m => m.indexOf(':') !== -1)
    .map((m) => {
      const meas = m.split(':');
      const measurableId = measurableIdMapping[meas[0]];
      if (measurableId && meas[1] && meas[1] !== '') {
        return {
          measurableId,
          measurement: parseMeasurement(measurableId, meas[1]),
          source,
        };
      }
      return null;
    }).filter(m => m !== null): any);
};

const getSchoolId = async (origSchoolName: string) => {
  let schoolName = origSchoolName;
  if (schoolName === 'Miami (FL)') {
    schoolName = 'Miami';
  }
  if (schoolName === 'Brigham Young') {
    schoolName = 'BYU';
  }
  const school: { id: number } = await db.oneOrNone(
    'select id from t_school where name = $(name)',
    { name: schoolName },
  );
  if (!school) {
    if (isDryRun) {
      return '0';
    }
    const newSchool: { id: number } = await db.one(
      'insert into t_school (name) values($(name)) returning id',
      { name: schoolName },
    );
    console.log(`Created new school: ${schoolName}`);
    return newSchool.id;
  }
  return school.id;
};

const insertMeasurement = async (playerId, measurableKey, measurement, source) => {
  const measurementAlreadyStored = !!(await db.oneOrNone(
    `select status from t_measurement
      where player_id=$(playerId) and measurable_id=$(measurableKey) and source=$(source)`,
    { playerId, measurableKey, source },
  ));
  if (measurementAlreadyStored) {
    console.log(`Skipping insert of ${measurablesByKey[measurableKey].name}: ${measurement}`);
    return;
  }
  console.log(`Inserting ${measurablesByKey[measurableKey].name}: ${measurement}`);
  await db.none(
    `insert into t_measurement (status, player_id, measurable_id, measurement, source)
      values (0, $(playerId), $(measurableKey), $(measurement), $(source))`,
    { playerId, measurableKey, measurement, source },
  );
};

const insertPositionEligibility = async (playerId, positionKey) =>
  db.none(
    `insert into t_position_eligibility (player_id, position_id, status)
      values ($(playerId), $(positionKey), 0)`,
    { playerId, positionKey },
  );

const getPlayerIdIfPlayerAlreadyExists = async (firstName, lastName, draftYear, schoolId) =>
  db.oneOrNone(
    `select id from t_player 
      where UPPER(first_name)=$(firstName)
        and UPPER(last_name)=$(lastName)
        and draft_year=$(draftYear)
        and school_id=$(schoolId)`,
    {
      firstName: firstName.toUpperCase(),
      lastName: lastName.toUpperCase(),
      draftYear,
      schoolId,
    },
  );

fetch(`http://www.nfldraftscout.com/ratings/dsprofile.php?pyid=${nfldsId}&draftyear=${combineYear}`)
  .then(res => res.text())
  .then(async (rawtext) => {
    let text = rawtext.substr(rawtext.indexOf('<!-- Start Player Picture Info Block -->'));
    text = text.substr(0, text.indexOf('<!-- ++Begin Video Bar Wizard Generated Code++ -->'));

    let nameSection = text.substr(text.indexOf('<strong>Name:</strong>') + 23);
    nameSection = nameSection.substr(0, nameSection.indexOf('</strong>'));
    nameSection = nameSection.substr(nameSection.indexOf('<strong>') + 8);
    nameSection = nameSection.replace(/\*/g, '');
    const [firstName, lastName] = nameSection.split(' ');

    let posSection = text.substr(text.indexOf('<strong>Position:</strong>') + 27);
    posSection = posSection.substr(0, posSection.indexOf('</a>'));
    const posName = posSection.substr(posSection.indexOf('color="#000000">') + 16);
    const posId = positionIdMapping[posName];

    let schoolSection = text.substr(text.indexOf('<B>College:</B>'));
    schoolSection = schoolSection.substr(0, schoolSection.indexOf('</a>'));
    const schoolName = schoolSection.substr(schoolSection.indexOf('color="#000000">') + 16);
    const schoolId = await getSchoolId(schoolName);

    let measurablesSection = text.substr(text.indexOf('Pro Day Results'));
    measurablesSection = measurablesSection.substr(measurablesSection.indexOf('<tr>') + 4);
    measurablesSection = measurablesSection.substr(0, measurablesSection.indexOf('</tr>'));

    let combineInviteeSection =
      measurablesSection.substr(measurablesSection.indexOf('Combine Invite:</strong>') + 24);
    combineInviteeSection =
      combineInviteeSection.substr(0, combineInviteeSection.indexOf('</strong>'));
    const wasCombineInvitee =
      combineInviteeSection.substr(combineInviteeSection.indexOf('<strong>') + 8) !== '';

    let proDaySection = measurablesSection;
    proDaySection = proDaySection.substr(proDaySection.indexOf('</td>') + 5);
    proDaySection = proDaySection.substr(proDaySection.indexOf('</td>') + 5);

    let combineSection = measurablesSection;
    combineSection = combineSection.substr(0, combineSection.indexOf('</td>', combineSection.indexOf('</td>') + 2));

    const proDayMeasurements = parseMeasurables(proDaySection, 2);
    const combineMeasurements = wasCombineInvitee ? parseMeasurables(combineSection, 1) : [];

    const mergedMeasurements = combineMeasurements;
    proDayMeasurements.forEach((pdMeasurement) => {
      let haveCombine = false;
      combineMeasurements.forEach((combineMeasurement) => {
        if (pdMeasurement.measurableId === combineMeasurement.measurableId) {
          haveCombine = true;
        }
      });

      if (!haveCombine) {
        mergedMeasurements.push(pdMeasurement);
      }
    });

    const measurablesString = mergedMeasurements.reduce((accum, meas) => {
      if (meas.source === 1) {
        return `${accum}\n\t${measurablesByKey[meas.measurableId].name}: ${meas.measurement}`;
      }
      return `${accum}\n\t${measurablesByKey[meas.measurableId].name}: ${meas.measurement}*`;
    }, '');

    console.log(`Adding ${firstName} ${lastName}, ${combineYear} ${posName} (${posId}) from ${schoolName} (${schoolId}) with ${measurablesString}`);

    if (!isDryRun) {
      let player =
        await getPlayerIdIfPlayerAlreadyExists(firstName, lastName, combineYear, schoolId);
      if (!player || !player.id) {
        const urlString = await createPlayer(firstName, lastName, combineYear, schoolId);
        player =
          await db.one('select id from t_player where canonical_name=$(urlString)', { urlString });
        console.log(`Added player id ${player.id}`);
      } else {
        console.log(`Found player id ${player.id}`);
      }
      if (player.id) {
        const playerHasEligibility =
          !!(await db.oneOrNone(
            'select player_id from t_position_eligibility where position_id = $(posId) and player_id = $(playerId)',
            { posId, playerId: player.id },
          ));
        if (!playerHasEligibility) {
          await insertPositionEligibility(player.id, posId);
          console.log('Added position eligibility');
        } else {
          console.log('Found position eligibility');
        }
        await Promise.all(mergedMeasurements.map(
          m => insertMeasurement(player.id, m.measurableId, m.measurement, m.source),
        ));
      } else {
        console.error('Failed to find or create player');
      }
    }

    process.exit(0);
  });

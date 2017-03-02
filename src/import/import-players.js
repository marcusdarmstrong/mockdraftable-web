// @flow

import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import db from '../connection';
import pullMeasurements from './pull-measurements';

if (process.argv.length < 4) {
  console.log('Usage: node import-players.js year position [--commit]');
  process.exit(1);
}

const combineYear: number = Number(process.argv[2]);
const nflPosition: string = process.argv[3];
const isDryRun: boolean = process.argv[4] !== '--commit';

const validPositions = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S', 'SPECIALISTS'];

if (!validPositions.includes(nflPosition)) {
  console.log(`Invalid position. Please select one of the following:
    ${JSON.stringify(validPositions)}`);
  process.exit(1);
}

if (!combineYear || combineYear > 2100 || combineYear < 2000) {
  console.log(`Invalid combine year: ${combineYear}. Please provide a valid year number.`);
  process.exit(1);
}

console.log(`Fetching ${nflPosition} combine invitees for ${combineYear}`);

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

const getSchoolId = async (nflCollegeName: string) => {
  let schoolName = nflCollegeName.replace('St.', 'State');
  if (schoolName === 'Central Florida') {
    schoolName = 'UCF';
  } else if (schoolName === 'Mississippi') {
    schoolName = 'Ole Miss';
  } else if (schoolName === 'N.C. State') {
    schoolName = 'NC State';
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
      { name: nflCollegeName },
    );
    console.log(`Created new school: ${nflCollegeName}`);
    return newSchool.id;
  }
  return school.id;
};

const isCanonicalNameInUse: string => Promise<boolean> = async name =>
  !!(await db.oneOrNone('select id from t_player where canonical_name = $(name)', { name }));

const getCanonicalName: (string, string) => Promise<?string> = async (firstName, lastName) => {
  const safeFirstName = firstName.replace(/[^\x00-\x7F]/g, '').toLowerCase();
  const safeLastName = lastName.replace(/[^\x00-\x7F]/g, '').toLowerCase();
  const firstTry = `${safeFirstName}-${safeLastName}`;
  if (!(await isCanonicalNameInUse(firstTry))) {
    return firstTry;
  }
  const secondTry = `${firstTry}-${combineYear}`;
  if (!(await isCanonicalNameInUse(secondTry))) {
    return secondTry;
  }
  const thirdTry = `${secondTry}-2`;
  if (!(await isCanonicalNameInUse(thirdTry))) {
    return thirdTry;
  }
  const fourthTry = `${secondTry}-3`;
  if (!(await isCanonicalNameInUse(fourthTry))) {
    return fourthTry;
  }
  const fifthTry = `${secondTry}-4`;
  if (!(await isCanonicalNameInUse(fifthTry))) {
    return fifthTry;
  }
  const lastTry = `${secondTry}-5`;
  if (!(await isCanonicalNameInUse(lastTry))) {
    return lastTry;
  }
  console.log('Unable to generate canonical name.');
  return null;
};

const insertMeasurement = async (playerId, measurableKey, measurement) =>
  isDryRun
    ? (() => {
      console.log(`Measurement: (${playerId}, ${measurableKey}, ${measurement})`);
    })()
    : db.none(
      `insert into t_measurement (status, player_id, measurable_id, measurement, source)
        values (0, $(playerId), $(measurableKey), $(measurement), 1)`,
      { playerId, measurableKey, measurement },
    );

let newids = 999999;
const insertPlayer = async (firstName, lastName, canonicalName, schoolId) =>
  isDryRun
    ? (() => {
      console.log(`Player: (${firstName}, ${lastName}, ${canonicalName}, ${schoolId})`);
      newids += 1;
      return newids;
    })()
    : (await db.one(
      `insert into t_player (status, first_name, last_name, draft_year, canonical_name, school_id)
        values (0, $(firstName), $(lastName), $(draftYear), $(canonicalName), $(schoolId))
        returning id`,
      {
        firstName,
        lastName,
        draftYear: combineYear,
        canonicalName,
        schoolId,
      },
    )).id;

const insertPositionEligibility = async (playerId, positionKey) =>
  isDryRun
    ? (() => {
      console.log(`Position: (${playerId}, ${positionKey})`);
    })()
    : db.none(
      `insert into t_position_eligibility (player_id, position_id, status)
        values ($(playerId), $(positionKey), 0)`,
      { playerId, positionKey },
    );

const playerAlreadyExists = async (firstName, lastName, schoolId) =>
  !!(await db.oneOrNone(
    `select id from t_player 
      where first_name=$(firstName)
        and last_name=$(lastName)
        and draft_year=$(combineYear)
        and school_id=$(schoolId)`,
    {
      firstName,
      lastName,
      combineYear,
      schoolId,
    },
  ));

/* nflData: {
  "resultUnit": "",
  "data": [
    {
      "id":2557998,
      "firstName":"Isaac",
      "lastName":"Asiata",
      "college":"Utah",
      "position":"OG",
      "result":null,
    }
  ]
} */

const doImport = async () => {
  let nflData = [];
  try {
    nflData = (await (await fetch(
      `http://www.nfl.com/liveupdate/combine/${combineYear}/BENCH_PRESS/${nflPosition}.json`,
    )).json()).data;
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }

  Promise.all(nflData.map(async (player) => {
    const positionKey = positionIdMapping[player.position];
    if (!positionKey) {
      console.log(
        `Unable to match ${player.firstName} ${player.lastName} ${player.position} to a position`,
      );
      return false;
    }

    try {
      const schoolId = await getSchoolId(player.college);

      if (await playerAlreadyExists(player.firstName, player.lastName, schoolId)) {
        console.log('Player already exists, skipping.');
        return false;
      }


      const canonicalName = await getCanonicalName(player.firstName, player.lastName);

      if (!canonicalName) {
        console.log('Unable to generate canonical name, skipping');
        return false;
      }

      const newPlayerId =
        await insertPlayer(player.firstName, player.lastName, canonicalName, schoolId);

      await insertPositionEligibility(newPlayerId, positionKey);

      const measurements = await pullMeasurements(player.id);

      if (!measurements) {
        console.log(`Unable to add measurements for ${JSON.stringify(player)}`);
        return false;
      }

      await insertMeasurement(newPlayerId, 1, measurements.height);
      await insertMeasurement(newPlayerId, 2, measurements.weight);
      await insertMeasurement(newPlayerId, 4, measurements.armLength);
      await insertMeasurement(newPlayerId, 5, measurements.handSize);
      console.log(`Successfully created player: ${player.firstName} ${player.lastName}`);
    } catch (e) {
      console.log(`Unable to create player: ${JSON.stringify(player)}, ${e.message}`);
      return false;
    }

    return true;
  }));
};


doImport().then(() => { console.log('Done with import'); });

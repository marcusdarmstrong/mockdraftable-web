// @flow

import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import db from '../connection';

if (process.argv.length < 5) {
  console.log('Usage: node import-measurable.js year position measurable [--commit]');
  process.exit(1);
}

const combineYear: number = Number(process.argv[2]);
const nflPosition: string = process.argv[3];
const measurable: string = process.argv[4];
const isDryRun: boolean = process.argv[5] !== '--commit';

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

const validMeasurables = {
  BENCH_PRESS: 9,
  FORTY_YARD_DASH: 8,
  VERTICAL_JUMP: 10,
  BROAD_JUMP: 11,
  THREE_CONE_DRILL: 12,
  TWENTY_YARD_SHUTTLE: 13,
  SIXTY_YARD_SHUTTLE: 14,
};

if (!Object.keys(validMeasurables).includes(measurable)) {
  console.log(`Invalid measurable. Please select one of the following:
    ${JSON.stringify(validMeasurables)}`);
  process.exit(1);
}


const getSchoolId = async (nflCollegeName: string) => {
  let schoolName = nflCollegeName.replace(' St.', ' State');
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
    return null;
  }
  return school.id;
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


const doImport = async () => {
  let nflData = [];
  try {
    nflData = (await (await fetch(
      `http://www.nfl.com/liveupdate/combine/${combineYear}/${measurable}/${nflPosition}.json`,
    )).json()).data;
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }

  await Promise.all(nflData.map(async (player) => {
    if (player.result === null) {
      console.log(`Null result: skipping for ${player.firstName} ${player.lastName}`);
      return false;
    }

    const schoolId = await getSchoolId(player.college);
    if (!schoolId) {
      console.log(`Unable to find player school: ${JSON.stringify(player)}`);
      return false;
    }

    try {
      const dbPlayer = await db.one(
        `select id from t_player
          where first_name = $(firstName)
            and last_name = $(lastName)
            and draft_year = $(combineYear)
            and school_id = $(schoolId)`,
        {
          firstName: player.firstName,
          lastName: player.lastName,
          combineYear,
          schoolId,
        },
      );

      const measurableKey = validMeasurables[measurable];

      const alreadyImported = !!await db.oneOrNone(
        `select id 
          from t_measurement
          where player_id=$(playerId)
            and measurable_id=$(measurableKey)
            and measurement=$(measurement)
            and source=1`,
        { playerId: dbPlayer.id, measurableKey, measurement: player.result },
      );

      if (!alreadyImported) {
        await insertMeasurement(dbPlayer.id, measurableKey, player.result);
      } else {
        console.log(`Already imported ${measurable} for ${player.firstName} ${player.lastName}`);
      }
    } catch (e) {
      console.log(`Failed to find player: ${e.message} ${JSON.stringify(player)}`);
      return false;
    }
    return true;
  }));
};

doImport().then(() => { console.log('Done with import'); process.exit(0); });

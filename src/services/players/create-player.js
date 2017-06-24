// @flow

import db from '../../connection';
import onError from '../../util/on-error';
import type { PlayerId, SchoolKey, PlayerKey } from '../../types/domain';

const isCanonicalNameInUse: string => Promise<boolean> = async name =>
  !!(await db.oneOrNone('select id from t_player where canonical_name = $(name)', { name }));

type GetCanonicalName = (string, string, number) => Promise<?PlayerId>;
const getCanonicalName: GetCanonicalName = async (firstName, lastName, draftYear) => {
  const safeFirstName = firstName.replace(' ', '-').replace(/[^0-9a-z-]/gi, '').toLowerCase();
  const safeLastName = lastName.replace(' ', '-').replace(/[^0-9a-z-]/gi, '').toLowerCase();
  const firstTry = `${safeFirstName}-${safeLastName}`;
  if (!(await isCanonicalNameInUse(firstTry))) {
    return firstTry;
  }
  const secondTry = `${firstTry}-${draftYear}`;
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
  return null;
};

const insertPlayer = async (firstName, lastName, draftYear, canonicalName, schoolId) =>
  (await db.one(
    `insert into t_player (status, first_name, last_name, draft_year, canonical_name, school_id)
      values (1, $(firstName), $(lastName), $(draftYear), $(canonicalName), $(schoolId))
      returning id`,
    {
      firstName,
      lastName,
      draftYear,
      canonicalName,
      schoolId,
    },
  )).id;

export type CreatedPlayer = {
  id: PlayerId,
  key: PlayerKey,
};

type CreatePlayer = (string, string, number, SchoolKey) => Promise<?CreatedPlayer>;
const createPlayer: CreatePlayer = async (firstName, lastName, draftYear, schoolKey) => {
  const canonicalName = await getCanonicalName(firstName, lastName, draftYear);
  if (canonicalName) {
    const key = await insertPlayer(firstName, lastName, draftYear, canonicalName, schoolKey);
    return { id: canonicalName, key };
  }
  return null;
};

export default onError(createPlayer);

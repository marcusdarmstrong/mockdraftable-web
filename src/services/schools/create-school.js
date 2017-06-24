// @flow

import db from '../../connection';
import onError from '../../util/on-error';

import type { SchoolKey } from '../../types/domain';

const createSchool = async (name: string): Promise<SchoolKey> =>
  db.one(
    'insert into t_school (name) values($(name)) returning id',
    { name },
  );

export default onError(createSchool);

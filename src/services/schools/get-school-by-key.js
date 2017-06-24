// @flow

import db from '../../connection';
import type { SchoolKey } from '../../types/domain';

const getSchoolByKey = async (key: SchoolKey) =>
  (await db.oneOrNone('select name from t_school where id=$(key)', { key })).name;

export default getSchoolByKey;

// @flow

import db from '../../connection';
import type { School } from '../../types/domain';

type GetAllSchools = () => Promise<Array<School>>;
const getAllSchools: GetAllSchools = async () =>
  db.many('select id, name from t_school order by name asc');

export default getAllSchools;

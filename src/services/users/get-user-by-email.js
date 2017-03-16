// @flow

import db from '../../connection';
import onError from '../../util/on-error';

const getUserByEmail = async (email: string) =>
  db.oneOrNone(
    `select 
        id,
        status,
        email, 
        pass_hash
      from t_user
      where email=$(email)`,
    { email },
  );

export default onError(getUserByEmail);

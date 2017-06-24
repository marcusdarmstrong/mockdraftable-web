// @flow

import db from '../../connection';
import onError from '../../util/on-error';
import type { UserId } from '../../types/state';

type DbUser = {
  id: UserId,
  status: number,
  email: string,
  pass_hash: string,
};

const getUserById = async (id: UserId): Promise<?DbUser> =>
  db.oneOrNone(
    `select 
        id,
        status,
        email, 
        pass_hash
      from t_user
      where id=$(id)`,
    { id },
  );

export default onError(getUserById);

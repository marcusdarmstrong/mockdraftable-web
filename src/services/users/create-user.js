// @flow

import db from '../../connection';
import onError from '../../util/on-error';
import { createPassHash } from '../../packages/pass-hash';

const createUser = async (email: string, password: string) =>
  db.oneOrNone(
    `insert into t_user ( 
        status,
        email, 
        pass_hash
      ) values (
        0,
        $(email),
        $(password)
      ) returning id;`,
    { email, password: createPassHash(email, password) },
  );

export default onError(createUser);

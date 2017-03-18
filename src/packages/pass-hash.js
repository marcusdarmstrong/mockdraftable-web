// @flow

import scrypt from 'scrypt';

export const createPassHash = (salt: string, password: string) =>
  scrypt.hashSync(password, { N: 16384, r: 8, p: 1 }, 64, new Buffer(salt)).toString('hex');

export const checkPassword = (salt: string, password: string, passhash: string) =>
  salt && password && passhash && createPassHash(salt, password) === passhash;

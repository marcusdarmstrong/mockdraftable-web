// @flow

import pgp from 'pg-promise';

const connectionString = process.env.DATABASE_URL || 'localhost';

export default pgp({})(`${connectionString}?ssl=true`);

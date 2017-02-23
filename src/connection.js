// @flow

import pgp from 'pg-promise';

const connectionString = process.env.HEROKU_POSTGRESQL_YELLOW 
  || process.env.DATABASE_URL || 'localhost';

export default pgp({})(`${connectionString}?ssl=true`);

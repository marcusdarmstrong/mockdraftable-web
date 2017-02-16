// @flow

import db from '../../connection';
import onError from '../../util/on-error';

const getPlayerByOldId = async id =>
  db.one(
    `select 
        p.id,
        p.status, 
        CONCAT(p.first_name, ' ', p.last_name) as name,
        canonical_name as url,
        draft_year as draftClass
      from t_player p 
      where p.oldid=$(id)`,
    { id },
  );

export default onError(getPlayerByOldId);

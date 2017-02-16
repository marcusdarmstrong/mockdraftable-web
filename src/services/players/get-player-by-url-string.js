// @flow

import db from '../../connection';
import onError from '../../util/on-error';

const getPlayerByUrlString = async urlString =>
  db.one(
    `select 
        p.id,
        p.status, 
        CONCAT(p.first_name, ' ', p.last_name) as name,
        canonical_name as url,
        draft_year as draftClass
      from t_player p 
      where p.canonical_name=$(urlString)`,
    { urlString },
  );

export default onError(getPlayerByUrlString);

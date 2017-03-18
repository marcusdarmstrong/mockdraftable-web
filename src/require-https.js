// @flow

import type { $Request, $Response, NextFunction } from 'express';

const requireHttps = (req: $Request, res: $Response, next: NextFunction) => {
  if (!req.secure) {
    res.redirect(301, `https://${req.hostname}${req.url}`);
  } else {
    next();
  }
};

export default requireHttps;

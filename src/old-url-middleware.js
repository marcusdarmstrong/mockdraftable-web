// @flow

import type { $Request, $Response, NextFunction } from 'express';
import { HttpRedirect, HttpError, asyncCatch, throw404 } from './packages/http';
import getPlayerByOldId from './services/players/get-player-by-old-id';

const oldUrlMiddleware =
  asyncCatch(async (req: $Request, res: $Response, next: NextFunction) => {
    const { path } = req;
    if (path.startsWith('/player/')) {
      const segments = path.split('/');
      const possibleOldId = Number(segments[2]);
      if (!isNaN(possibleOldId)) {
        const newPlayer = await getPlayerByOldId(possibleOldId) || throw404(path);
        throw new HttpRedirect(301, `/player/${newPlayer.url}`);
      }
    } else if (path.startsWith('/players/')) {
      throw new HttpRedirect(301, '/search');
    } else if (path.startsWith('/player_embed/')) {
      const segments = path.split('/');
      if (segments.length < 3) {
        throw new HttpError(404, path);
      }
      const oldId = parseInt(segments[2], 10);
      if (isNaN(oldId) || oldId < 1) {
        throw new HttpError(404, path);
      }
      const newPlayer = await getPlayerByOldId(oldId) || throw404(path);
      throw new HttpRedirect(301, `/embed/${newPlayer.url}`);
    }
    next();
  });

export default oldUrlMiddleware;

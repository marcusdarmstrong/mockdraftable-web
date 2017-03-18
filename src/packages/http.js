// @flow

import type { $Request, $Response, NextFunction } from 'express';

export class HttpRedirect extends Error {
  code: number;
  location: string;

  constructor(code: number, location: string) {
    super();
    this.code = code;
    this.location = location;
  }

  toString() {
    return `Redirect: ${this.location}`;
  }
}

export class HttpError extends Error {
  code: number;
  message: string;

  constructor(code: number, message: string) {
    super();
    this.code = code;
    this.message = message;
  }

  toString() {
    return `HTTP Error: ${this.code}, ${this.message}`;
  }
}

export class InternalError extends Error {
  message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }

  toString() {
    return this.message;
  }
}

export const throw404 = (path: string) => { throw new HttpError(404, path); };
export const throw500 = (message: string) => { throw new InternalError(message); };

export const errorHandler = (errorPage: (string) => string) =>
  (err: ?Error, req: $Request, res: $Response, next: NextFunction) => {
    if (err instanceof HttpRedirect) {
      res.redirect(err.code, err.location);
      return;
    }
    if (err instanceof HttpError) {
      res.status(err.code).send(errorPage('Page not found.'));
      return;
    }
    if (err) {
      console.error(err);
      res.status(500).send(errorPage('Something broke!'));
      return;
    }

    next(err);
  };

type AsyncHandler = (req: $Request, res: $Response, next: NextFunction) => Promise<void>;

export const asyncCatch = (func: AsyncHandler) =>
  async (req: $Request, res: $Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (err) {
      next(err);
    }
  };

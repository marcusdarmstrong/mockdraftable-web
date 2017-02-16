// @flow

export class HttpRedirect {
  code: number;
  location: string;

  constructor(code: number, location: string) {
    this.code = code;
    this.location = location;
  }

  toString() {
    return `Redirect: ${this.location}`;
  }
}

export class HttpError {
  code: number;
  message: string;

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }

  toString() {
    return `HTTP Error: ${this.code}, ${this.message}`;
  }
}

export class InternalError {
  message: string;

  constructor(message: string) {
    this.message = message;
  }

  toString() {
    return this.message;
  }
}

export const throw404 = (path: string) => { throw new HttpError(404, path); };
export const throw500 = (message: string) => { throw new InternalError(message); };

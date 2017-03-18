// @flow

import type { MiddlewareAPI, Action, Dispatch } from 'redux';

export type BatchedAction = Array<Action> | Action | (() => any) | Promise<any>;

export default <S> ({ dispatch }: MiddlewareAPI<S, BatchedAction>) =>
  (next: Dispatch<BatchedAction>): Dispatch<BatchedAction> =>
    (actions: BatchedAction): BatchedAction =>
      (Array.isArray(actions))
        ? actions.reduce((chain, action) => chain.then(() => dispatch(action)), Promise.resolve())
        : next(actions);

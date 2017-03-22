// @flow

import type { State } from '../types/state';
import { updatePage } from '../redux/actions';

const name = 'HOME';
const url = (state: State) => state.page === name ? '/' : null;
const actions = (path: string) => path === '/' ? [updatePage(name)] : null;
const title = (state: State) => state.page === name ? 'MockDraftable' : null;

export { url, title, actions, name };

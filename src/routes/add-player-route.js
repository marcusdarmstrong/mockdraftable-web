// @flow

import type { State } from '../types/state';
import { selectSchools } from '../redux/actions';

const name = 'ADD_PLAYER';
const url = (state: State) => state.page === name ? '/add-player' : null;
const actions = (path: string) => path === '/add-player' ? [selectSchools()] : null;
const title = (state: State) => state.page === name ? 'Add Player - MockDraftable' : null;

export { url, title, actions, name };

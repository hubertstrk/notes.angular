import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SettingsState } from './settings.reducers';
import { selectNotes } from '@store/note/note.selectors';
import { uniq } from 'lodash';

export const selectSettingsState =
  createFeatureSelector<SettingsState>('settings');

export const selectBasePath = createSelector(
  selectSettingsState,
  state => state.basePath
);

export const selectDarkMode = createSelector(
  selectSettingsState,
  state => state.dark
);

export const selectArchived = createSelector(
  selectSettingsState,
  selectNotes,
  (state, notes) => {
    const validPaths = notes.map(x => x.path);
    return uniq(state.archived.filter(x => validPaths.includes(x)));
  }
);

export const selectSettingsError = createSelector(
  selectSettingsState,
  state => state.error
);

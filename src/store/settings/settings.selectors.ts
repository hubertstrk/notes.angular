import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SettingsState } from './settings.reducers';

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

export const selectSettingsError = createSelector(
  selectSettingsState,
  state => state.error
);

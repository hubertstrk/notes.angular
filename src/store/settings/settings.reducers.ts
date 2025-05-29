import { createReducer, on } from '@ngrx/store';
import {
  loadSettingsSuccess,
  loadSettingsFailure,
  saveSettingsSuccess,
  saveSettingsFailure,
} from './settings.actions';

export interface SettingsState {
  basePath: string | null;
  dark: boolean;
  id: string | null;
  error: string | null;
}

export const initialState: SettingsState = {
  basePath: null,
  dark: true,
  id: null,
  error: null,
};

export const settingsReducer = createReducer(
  initialState,
  on(
    loadSettingsSuccess,
    (state, { settings }): SettingsState => ({
      ...state,
      ...settings,
      error: null,
    })
  ),
  on(
    loadSettingsFailure,
    (state, { error }): SettingsState => ({
      ...state,
      error,
    })
  ),
  on(
    saveSettingsSuccess,
    (state, { settings }): SettingsState => ({
      ...state,
      ...settings,
    })
  ),
  on(
    saveSettingsFailure,
    (state, { error }): SettingsState => ({
      ...state,
      error,
    })
  )
);

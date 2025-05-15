import { createReducer, on } from '@ngrx/store';
import {
  setBasePath,
  loadSettingsSuccess,
  loadSettingsFailure,
} from './settings.actions';

export interface SettingsState {
  basePath: string | null;
  error: string | null;
}

export const initialState: SettingsState = {
  basePath: null,
  error: null,
};

export const settingsReducer = createReducer(
  initialState,
  on(
    setBasePath,
    (state, { basePath }): SettingsState => ({
      ...state,
      basePath,
    })
  ),
  on(
    loadSettingsSuccess,
    (state, { basePath }): SettingsState => ({
      ...state,
      basePath,
    })
  ),
  on(
    loadSettingsFailure,
    (state, { error }): SettingsState => ({
      ...state,
      error,
    })
  )
);

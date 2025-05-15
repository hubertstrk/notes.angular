import { createAction, props } from '@ngrx/store';

export const setBasePath = createAction(
  '[Settings] Set Base Path',
  props<{ basePath: string }>()
);

export const loadSettings = createAction('[Settings] Load Settings');

export const loadSettingsSuccess = createAction(
  '[Settings] Load Settings Success',
  props<{ basePath: string }>()
);

export const loadSettingsFailure = createAction(
  '[Settings] Load Settings Failure',
  props<{ error: string }>()
);

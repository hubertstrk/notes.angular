import { createAction, props } from '@ngrx/store';

export const updateCursorPosition = createAction(
  '[Editor] Update Cursor Position',
  props<{ line: number; column: number }>()
);

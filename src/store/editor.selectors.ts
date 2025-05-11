import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EditorState } from './editor.reducers';

export const selectEditorState = createFeatureSelector<EditorState>('editor');

export const selectCursorPosition = createSelector(
  selectEditorState,
  (editorState: EditorState) => editorState.cursorPosition
);

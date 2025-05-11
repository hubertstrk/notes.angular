import { createReducer, on } from '@ngrx/store';
import { updateCursorPosition } from './editor.actions';

export interface EditorState {
  cursorPosition: {
    line: number;
    column: number;
  };
}

export const initialEditorState: EditorState = {
  cursorPosition: {
    line: 0,
    column: 0,
  },
};

export const editorReducer = createReducer(
  initialEditorState,
  on(
    updateCursorPosition,
    (state, { line, column }): EditorState => ({
      ...state,
      cursorPosition: { line, column },
    })
  )
);

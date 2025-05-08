import { createReducer, on } from '@ngrx/store';
import {
  notesLoaded,
  loadNotesFailed,
  selectNote,
  updateNoteContent,
  saveNoteFailed,
} from './note.actions';
import { Note } from '../model/note.model';

export interface State {
  notes: Note[];
  selectedNotePath: string | null;
  isSaving: boolean;
  error: string | null;
}

export const initialState: State = {
  notes: [],
  selectedNotePath: null,
  isSaving: false,
  error: null,
};

export const noteReducer = createReducer(
  initialState,
  on(
    notesLoaded,
    (state, { notes }): State => ({
      ...state,
      notes,
    })
  ),
  on(
    loadNotesFailed,
    (state, { error }): State => ({
      ...state,
      error,
    })
  ),
  on(
    selectNote,
    (state, { notePath }): State => ({
      ...state,
      selectedNotePath: notePath,
    })
  ),
  on(updateNoteContent, (state, { notePath, content }): State => {
    const notes = state.notes.map(note =>
      note.path === notePath ? { ...note, content } : note
    );
    return {
      ...state,
      notes,
    };
  }),
  on(
    saveNoteFailed,
    (state, { error }): State => ({
      ...state,
      error,
    })
  )
);

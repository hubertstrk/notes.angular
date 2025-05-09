import { createReducer, on } from '@ngrx/store';
import {
  notesLoaded,
  loadNotesFailed,
  setActiveNote,
  updateContent,
  saveNoteFailed,
} from './note.actions';
import { Note } from '../model/note.model';

export interface State {
  notes: Note[];
  activeNotePath: string | null;
  isSaving: boolean;
  error: string | null;
}

export const initialState: State = {
  notes: [],
  activeNotePath: null,
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
    setActiveNote,
    (state, { notePath }): State => ({
      ...state,
      activeNotePath: notePath,
    })
  ),
  on(updateContent, (state, { notePath, content }): State => {
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

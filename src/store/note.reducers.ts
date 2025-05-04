import { createReducer, on } from '@ngrx/store';
import { notesLoaded, loadNotesFailed } from './note.actions';
import { Note } from '../model/note.model';

export interface State {
  notes: Note[];
  error: string | null;
}

export const initialState: State = {
  notes: [],
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
  )
);

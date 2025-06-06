import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NoteState } from './note.reducers';

export const selectNoteState = createFeatureSelector<NoteState>('note');

export const selectNotes = createSelector(
  selectNoteState,
  (state: NoteState) => state.notes
);

export const selectNoteByPath = (path: string) =>
  createSelector(selectNotes, notes => {
    const note = notes.find(note => note.path === path);
    return note ? note : null;
  });

export const selectActiveNote = createSelector(
  selectNoteState,
  (state: NoteState) => {
    if (!state.activeNotePath) {
      return null;
    }

    const activeNote = state.notes.find(
      note => note.path === state.activeNotePath
    );

    return activeNote || null;
  }
);

export const selectError = createSelector(
  selectNoteState,
  (state: NoteState) => state.error
);

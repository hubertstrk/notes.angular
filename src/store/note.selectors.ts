import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from './note.reducers';

export const selectNoteState = createFeatureSelector<State>('note');

export const selectNotes = createSelector(
  selectNoteState,
  (state: State) => state.notes
);

export const selectNoteByPath = (path: string) =>
  createSelector(selectNotes, notes => {
    const note = notes.find(note => note.path === path);
    return note ? note : null;
  });

export const selectActiveNote = createSelector(
  selectNoteState,
  (state: State) => {
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
  (state: State) => state.error
);

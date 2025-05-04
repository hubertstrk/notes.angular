import { createFeatureSelector, createSelector } from '@ngrx/store';

import { State } from './note.reducers';

const selectNoteState = createFeatureSelector<State>('note');

export const selectNotes = createSelector(
  selectNoteState,
  (state: State) => state.notes
);

export const selectNote = (path: string) =>
  createSelector(selectNotes, notes => {
    const note = notes.find(note => note.path === path);
    return note ? note : null;
  });

export const selectError = createSelector(
  selectNoteState,
  (state: State) => state.error
);

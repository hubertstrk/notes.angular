import { createAction, props } from '@ngrx/store';
import { Note } from '../model/note.model';

export const loadNotes = createAction(
  '[Note] Load all notes',
  props<{ directory: string }>()
);

export const notesLoaded = createAction(
  '[Note] Notes loaded',
  props<{ notes: Note[] }>()
);

export const loadNotesFailed = createAction(
  '[Note] Loading notes failed',
  props<{ error: string }>()
);

export const setActiveNote = createAction(
  '[Note] Set active note by path',
  props<{ notePath: string }>()
);

export const updateContent = createAction(
  '[Note] Update note content',
  props<{ notePath: string; content: string; heading: string }>()
);

export const noteSaved = createAction(
  '[Note] Note saved',
  props<{ notePath: string }>()
);

export const saveNoteFailed = createAction(
  '[Note] Saving note failed',
  props<{ error: string }>()
);

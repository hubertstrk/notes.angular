import { createAction, props } from '@ngrx/store';
import { Note } from '../model/note.model';

export const loadNotes = createAction(
  '[Note] Load Notes',
  props<{ directory: string }>()
);

export const notesLoaded = createAction(
  '[Note] Notes Loaded',
  props<{ notes: Note[] }>()
);

export const loadNotesFailed = createAction(
  '[Note] Load Notes Failed',
  props<{ error: string }>()
);

export const selectNote = createAction(
  '[Note] Select Note',
  props<{ notePath: string }>()
);

export const updateNoteContent = createAction(
  '[Note] Update Note Content',
  props<{ notePath: string; content: string }>()
);

export const saveNote = createAction(
  '[Note] Save Note',
  props<{ notePath: string; content: string }>()
);

export const noteSaved = createAction(
  '[Note] Note Saved',
  props<{ notePath: string }>()
);

export const saveNoteFailed = createAction(
  '[Note] Save Note Failed',
  props<{ error: string }>()
);
